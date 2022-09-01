<script>
  import Link from "./Link.svelte";

  export let title = "BLANK";
  export let cardImage;
  export let githubLink;
  export let webappLink;
  export let downloadLink;

  $: background = `background: ${cardImage || "#54bdb4"};`;

  let isExpanded = false;
</script>

<div class="card rounded shadow">
  <div
    class="card_image rounded shadow {isExpanded ? 'shrink' : ''}"
    on:click={() => (isExpanded = !isExpanded)}
    style={background}
  >
    <span class="rounded">{title}</span>
  </div>
  <div class="card_content rounded {!isExpanded ? 'hide' : ''}">
    <div class="description">
      <slot />
    </div>
    <div class="links">
      {#if githubLink}
        <Link
          href={githubLink}
          alt="Link to github"
          icon="fa-brands fa-github"
          size={20}
        />
      {/if}
      {#if webappLink}
        <Link
          href={webappLink}
          alt="Link to web app"
          icon="fa-solid fa-arrow-up-right-from-square"
          size={20}
        />
      {/if}
      {#if downloadLink}
        <Link
          href={downloadLink}
          alt="Download link"
          icon="fa-solid fa-download"
          size={20}
        />
      {/if}
    </div>
  </div>
</div>

<style>
  .card {
    margin: 10px;
    width: 47%;
    max-height: 250px;
    background-color: #232625;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    overflow: hidden;
  }

  .card_image {
    width: 100%;
    height: 150px;
    padding: 8px;
    transition: 0.2s;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    background-position: center !important;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    box-shadow: inset 6px 6px 6px -4px #fefefe5a;
  }

  .card_image span {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 4px 8px;
    color: #232625;
    font-weight: bold;
    user-select: none;
  }

  .card_content {
    width: calc(100% - 8px);
    height: 125px;
    margin: 4px;
    transition: 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
  }

  .description {
    width: 100%;
    height: 100%;
    padding: 4px 8px;
    font-size: 14px;
    overflow-y: scroll;
  }

  .links {
    align-self: flex-end;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    justify-self: flex-end;
    width: 100%;
    height: 40px;
    background-color: #2f2f2f;
    padding: 0px 8px;
  }

  .hide {
    height: 0px;
    margin: 0px;
  }

  .shrink {
    margin: 4px;
    height: 125px;
    width: calc(100% - 8px);
  }

  @media (max-width: 830px) {
    .card {
      width: 100%;
    }
  }
</style>
