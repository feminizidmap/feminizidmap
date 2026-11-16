import StrapiPage from "../StrapiPage";
import { getImprint } from "../../services/api";

export default function Page() {
  return <StrapiPage load={getImprint} fallbackTitle="Imprint" />;
}
