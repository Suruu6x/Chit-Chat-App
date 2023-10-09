import { Box } from "@chakra-ui/react";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="#38B2AC"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <MdOutlineClose
        size={15}
        style={{
          marginLeft: "2px",
          marginRight: "-5px",
          marginBottom: "-1px",
        }}
      />
    </Box>
  );
};

export default UserBadgeItem;
