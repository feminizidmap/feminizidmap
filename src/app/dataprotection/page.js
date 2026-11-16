import StrapiPage from "../StrapiPage";
import { getDataprotection } from "../../services/api";

export default function Page() {
  return <StrapiPage load={getDataprotection} fallbackTitle="Data protection" />;
}
