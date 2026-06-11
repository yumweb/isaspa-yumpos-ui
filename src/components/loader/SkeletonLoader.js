import { Divider, ListItem, ListItemText, Skeleton } from "@mui/material";
import React from "react";

export function SkeletonLoader() {
  return Array(6)
    .fill(0)
    .map((i, x) => (
      <React.Fragment key={`MedSkele${x}`}>
        <ListItem>
          <ListItemText
            primary={<Skeleton />}
            secondary={<Skeleton width="80%" />}
          />
        </ListItem>
        <Divider variant="inset" />
      </React.Fragment>
    ));
}
