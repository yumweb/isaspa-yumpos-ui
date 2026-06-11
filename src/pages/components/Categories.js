import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFolder } from "@fortawesome/free-solid-svg-icons";
import clientAdapter from "../../lib/clientAdapter";
import { Link } from "@mui/material";
import { uniq } from "lodash";

const getCategoryColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 88%)`;
};

const Categories = ({ addItemToCart }) => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const getCats = async () => {
    try {
      const res = await clientAdapter.getItemCategories(categoryId, true);
      const filteredCategories =
        categoryId === 0
          ? res[0].filter((cat) => !cat.deleted)
          : res.filter((cat) => !cat.deleted);
      setCategories(filteredCategories);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryItems = async (categoryId) => {
    try {
      const res = await clientAdapter.getCategoriesId(categoryId);
      setCategoryItems(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryClick = (category) => {
    const breadCrumb = [...selectedCategory, category];
    setSelectedCategory(uniq(breadCrumb));
    setCategoryId(category.id);
  };

  const handleItemCategory = async (item) => {
    try {
      const ires = await clientAdapter.getItemsById(item.itemId);

      if (ires) {
        console.log("item being added", ires);
        addItemToCart({
          ...ires,
          category: item?.item?.category?.name,
          costPrice: ires?.costPrice,
          unitPrice: ires?.unitPrice,
          type: "item",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemKitCategory = async (itemKit) => {
    try {
      const ikres = await clientAdapter.getItemDetails(itemKit?.itemKitId);
      if (ikres) {
        addItemToCart({
          ...ikres,
          category: itemKit?.itemKit?.category?.name,
          costPrice: ikres?.itemkit?.costPrice,
          unitPrice: ikres?.itemkit?.unitPrice,
          type: "itemkit",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveCategory = (category) => {
    const index = selectedCategory.findIndex((cat) => cat.id === category.id);

    if (index !== -1) {
      const updatedBreadcrumb = selectedCategory.slice(0, index + 1);
      setSelectedCategory(updatedBreadcrumb);
      setCategoryId(category.id);
    }
  };

  const handleResetCat = () => {
    setSelectedCategory([]);
    setCategoryId(0);
  };

  useEffect(() => {
    const getCategoryItemsData = async () => {
      await getCategoryItems(categoryId);
    };
    getCategoryItemsData();
  }, [categoryId]);

  useEffect(() => {
    const getCategories = async () => {
      await getCats();
    };
    getCategories();
  }, [categoryId]);

  return (
    <>
      <div id="grid_breadcrumbs">
        <div className="category_breadcrumbs_item" data-category_id="0">
          <Link onClick={handleResetCat}>All</Link>
          {selectedCategory.length > 0 &&
            selectedCategory.map((cat, index) => (
              <span
                key={index}
                className="category_breadcrumbs_arrow"
                onClick={() => handleRemoveCategory(cat)}
              >
                {" "}
                <FontAwesomeIcon icon={faArrowRight} /> {cat.name}
              </span>
            ))}
        </div>
      </div>
      <div id="category_item_selection" className="row register-grid">
        {categories.length > 0 &&
          categories?.map((cat, x) => (
            <div
              key={`${cat.id}${x}`}
              className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6"
              style={{ backgroundColor: getCategoryColor(cat.name) }}
              onClick={() => handleCategoryClick(cat)}
            >
              <p>
                <FontAwesomeIcon icon={faFolder} />
                <br />
                {cat.name}
              </p>
            </div>
          ))}

        {categoryItems.items?.length > 0 &&
          categoryItems.items?.map((i, i1) => {
            const locationItemCostPrice = i.locationItem?.costPrice;
            const mainObjectCostPrice = i.costPrice;

            if (
              (locationItemCostPrice !== null && locationItemCostPrice !== 0) ||
              (mainObjectCostPrice !== null && mainObjectCostPrice !== 0)
            ) {
              const costPrice = locationItemCostPrice || mainObjectCostPrice;

              return (
                <div
                  key={i1}
                  onClick={() => handleItemCategory(i)}
                  className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6"
                >
                  <p>
                    {i.name}
                    <br />
                    (Rs.{costPrice})
                  </p>
                </div>
              );
            }
            return null;
          })}

        {categoryItems.itemKits?.length > 0 &&
          categoryItems.itemKits.map((ik, ik1) => {
            const locationItemCostPrice = ik.locationItemKits?.costPrice;
            const mainObjectCostPrice = ik.costPrice;

            if (
              (locationItemCostPrice !== null && locationItemCostPrice !== 0) ||
              (mainObjectCostPrice !== null && mainObjectCostPrice !== 0)
            ) {
              const costPrice = locationItemCostPrice || mainObjectCostPrice;
              return (
                <div
                  key={ik1}
                  onClick={() => handleItemKitCategory(ik)}
                  className="category_item category col-md-2 register-holder categories-holder col-sm-3 col-xs-6"
                >
                  <p>
                    {ik.name}
                    <br />
                    (Rs.{costPrice})
                  </p>
                </div>
              );
            }
            return null;
          })}
      </div>
    </>
  );
};

export default Categories;
