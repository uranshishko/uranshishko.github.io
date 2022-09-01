<script>
  import Tabs from "./Tabs.svelte";
  import AboutMe from "../views/AboutMe.svelte";
  import Education from "../views/Education.svelte";
  import Portofolio from "../views/Portofolio.svelte";

  let currentTab = "about me";

  function switchTab(tabName) {
    currentTab = tabName.detail;
  }
</script>

<div class="container">
  <Tabs on:tabToggle={switchTab} />
  {#if currentTab === "about me"}
    <AboutMe />
  {/if}
  {#if currentTab === "education"}
    <Education />
  {/if}
  {#if currentTab === "portofolio"}
    <Portofolio />
  {/if}
</div>

<style>
  .container {
    display: flex;
    margin-top: 4px;
    justify-content: center;
    align-items: flex-start;
    width: 90%;
    min-height: 48vh;
    max-height: 80vh;
    height: 100%;
  }

  @media (max-width: 800px) {
    .container {
      flex-direction: column-reverse;
      align-items: center;
      max-height: 99vh;
      width: 95%;
    }
  }
</style>
