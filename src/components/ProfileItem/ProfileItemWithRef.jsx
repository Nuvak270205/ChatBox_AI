import React, { forwardRef } from "react";
import ProfileItem from "./ProfileItem";

const ProfileItemWithRef = forwardRef((props, ref) => {
  return <ProfileItem {...props} innerRef={ref} />;
});

export default ProfileItemWithRef;
