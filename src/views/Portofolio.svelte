<script>
  import { t } from "../i18n";
  import { populateProjects } from "../stores";

  import BaseLayout from "../components/BaseLayout.svelte";
  import Card from "../components/Card.svelte";

  let colors = ["#468189", "#77ACA2", "#9DBEBB"];

  let randomNum = () => Math.round(Math.random() * 4);
</script>

<BaseLayout title={$t("portofolio.title")}>
  {#await populateProjects()}
    <div class="load_screen">
      <div class="load_spinner" />
    </div>
  {:then repos}
    <div class="cards">
      {#each repos as repo}
        {#if repo.name !== "uranshishko" && repo.name !== "HA_Fetcher"}
          <Card
            title={repo.name.toUpperCase()}
            cardImage={colors[randomNum()]}
            githubLink={repo.html_url}
          >
            <b>{repo.name.toUpperCase()}</b><br />{repo.description}
          </Card>
        {/if}
      {/each}
    </div>
  {/await}
</BaseLayout>

<style>
  .cards {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-start;
    overflow-y: scroll;
    gap: 0px !important;
  }

  .load_screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .load_spinner {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    border: 10px solid #54bdb4;
    border-bottom: 10px solid transparent;
    animation: spin 0.5s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
