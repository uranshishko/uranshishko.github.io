<script>
  import { createEventDispatcher } from "svelte";
  import { t } from "../i18n";
  import Tab from "./Tab.svelte";

  const dispatch = createEventDispatcher();

  let tabs = [
    ["about me", true],
    ["education", false],
    ["portofolio", false],
  ];

  function tabClickHandler(tabName) {
    dispatch("tabToggle", tabName);
    tabs.forEach((tab) => (tab[1] = false));
    let tabIndex = tabs.findIndex((tab) => tab[0] === tabName);
    tabs[tabIndex][1] = true;
  }
</script>

<div class="tabs rounded shadow">
  <Tab
    clickHandler={tabClickHandler.bind(this, "about me")}
    isActive={tabs[0][1]}
  >
    <i class="fa-solid fa-user-astronaut" />
    {#if tabs[0][1]}
      <span class="tag">{$t("tabs.aboutme")}</span>
    {/if}
  </Tab>
  <span class="separator" />
  <Tab
    clickHandler={tabClickHandler.bind(this, "education")}
    isActive={tabs[1][1]}
  >
    <i class="fa-solid fa-graduation-cap" />
    {#if tabs[1][1]}
      <span class="tag">{$t("tabs.education")}</span>
    {/if}
  </Tab>
  <span class="separator" />
  <Tab
    clickHandler={tabClickHandler.bind(this, "portofolio")}
    isActive={tabs[2][1]}
  >
    <i class="fa-solid fa-briefcase" />
    {#if tabs[2][1]}
      <span class="tag">{$t("tabs.portofolio")}</span>
    {/if}
  </Tab>
</div>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-right: 5px;
    height: 152px;
    min-width: 50px;
    overflow: hidden;
  }

  .separator {
    background-color: #54bdb4;
    width: 100%;
    height: 1px;
  }

  .tag {
    display: none;
  }

  @media (max-width: 800px) {
    .tabs {
      flex-direction: row;
      width: 100%;
      height: 50px;
      margin: 5px 0px;
    }
    .separator {
      width: 0px;
      height: 0px;
    }

    .tag {
      margin-top: 2px;
      font-size: 11px;
      display: initial;
    }
  }
</style>
