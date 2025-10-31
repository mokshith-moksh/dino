import { useQueryClient } from "@tanstack/react-query";

const UseRefetch = () => {
  const querlyClient = useQueryClient();
  return async () => {
    await querlyClient.refetchQueries({
      type: "active",
    });
  };
};

export default UseRefetch;
