<script>
  import { t } from "../i18n";
  import {
    databaseItems,
    webDevItems,
    programmingLanguagesItems,
  } from "../stores";

  import BaseLayout from "../components/BaseLayout.svelte";
  import Dropdown from "../components/Dropdown.svelte";
</script>

<BaseLayout title={$t("education.title")}>
  <div>
    <Dropdown title={$t("education.skills.webdev")} items={$webDevItems} />
    <hr />
    <Dropdown title={$t("education.skills.databases")} items={$databaseItems} />
    <hr />
    <Dropdown
      title={$t("education.skills.programingLanguages")}
      items={$programmingLanguagesItems}
    />
    <hr />
  </div>
</BaseLayout>

<style>
  div {
    width: 100%;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 30px;
  }

  hr {
    width: 10%;
    border: 2px solid #232625;
  }

  @media (max-width: 800px) {
    div {
      padding: 8px;
    }
  }
</style>
