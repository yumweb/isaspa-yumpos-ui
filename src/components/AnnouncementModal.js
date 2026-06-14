import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { AppRoutes } from "../routes";

// Shown once per login. The flag is cleared at login (SignIn → setLocation),
// so it reappears on the next sign-in but not on refreshes/navigation.
const SEEN_KEY = "yumpos_announcement_seen";

const AnnouncementModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
      window.localStorage.setItem(SEEN_KEY, "1");
    }
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <Box sx={{ position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", right: 8, top: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ textAlign: "center", pt: 5, px: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: "success.main", fontWeight: 700, letterSpacing: 1 }}
          >
            New • Premium
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Announcing the launch of WhatsApp &amp; Google My Business Profile
            Manager
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            New premium features to manage your WhatsApp messaging and your
            Google Business reviews, posts and insights — right inside YumPOS.
          </Typography>

          <Stack
            direction="row"
            spacing={5}
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            <Box
              role="button"
              onClick={() => go(AppRoutes.WhatsApp.path)}
              sx={{
                cursor: "pointer",
                textAlign: "center",
                transition: "transform .15s",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <FontAwesomeIcon
                icon={faWhatsapp}
                style={{ fontSize: 56, color: "#25D366" }}
              />
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, fontWeight: 600 }}
              >
                WhatsApp
              </Typography>
            </Box>
            <Box
              role="button"
              onClick={() => go(AppRoutes.GoogleMyBusiness.path)}
              sx={{
                cursor: "pointer",
                textAlign: "center",
                transition: "transform .15s",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <FontAwesomeIcon
                icon={faGoogle}
                style={{ fontSize: 56, color: "#4285F4" }}
              />
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1, fontWeight: 600 }}
              >
                Google My Business
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              mt: 3,
              p: 1.5,
              bgcolor: "#F1F4F5",
              borderRadius: 1,
              color: "text.secondary",
            }}
          >
            Get in touch with{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              YumPOS Support
            </Box>{" "}
            at{" "}
            <Link
              href="https://wa.me/919100906273"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
            >
              +91 91009 06273
            </Link>{" "}
            to get your WhatsApp and Google My Business integrated for your
            location.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button variant="contained" onClick={() => setOpen(false)}>
            Got it
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AnnouncementModal;
