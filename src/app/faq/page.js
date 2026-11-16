import StrapiPage from "../StrapiPage";
import { getFaq } from "../../services/api";

export default function Page() {
  return <StrapiPage load={getFaq} fallbackTitle="FAQ" />;
}
