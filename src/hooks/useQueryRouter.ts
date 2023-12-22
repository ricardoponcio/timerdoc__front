import { useLocation } from "react-router-dom";

function useQueryRouter() {
  return new URLSearchParams(useLocation().search);
}

export { useQueryRouter };
