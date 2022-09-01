<script>
  import { fade } from "svelte/transition";
  import { locale, isTranslate } from "../i18n";

  import Link from "./Link.svelte";

  export let title = "Title";

  $: $isTranslate ? locale.set("en") : locale.set("sv");
</script>

<svelte:head>
  <title>Uran Shishko • {title}</title>
</svelte:head>

<div class="base_layout">
  <div class="tool_bar shadow rounded">
    <span><b>{title}</b></span>
    <span class="tools">
      <Link
        href="https://github.com/uranshishko/uranshishko.github.io"
        icon="fa-brands fa-github"
        alt="portofolio githup repo"
        size={20}
      />
      <span>• • </span>
      <label for="toggle">
        <input type="checkbox" bind:checked={$isTranslate} id="toggle" />
        <div class="toggle {$isTranslate ? 'on' : ''}">
          <div class="toggler" />
        </div>
      </label>
      <i class="fa-solid fa-language" />
    </span>
  </div>
  <div class="content shadow rounded" in:fade>
    <slot />
  </div>
</div>

<style>
  .base_layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-width: 260px;
    min-height: 250px;
    max-width: 1000px;
    width: 100%;
    height: 100%;
  }

  .tool_bar {
    width: 100%;
    height: 30px;
    min-height: 30px;
    background-color: #2f2f2f;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 20px;
    font-size: 16px;
  }

  .content {
    background-color: #2f2f2f;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px;
    width: 100%;
    height: 100%;
    max-height: calc(100% - 32px);
    border-radius: 5;
  }

  .tools {
    width: 130px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .tools label input[type="checkbox"] {
    display: none;
  }

  .toggle {
    height: 20px;
    width: 40px;
    border: 1px solid #fefefe;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0px;
    background-color: #232625;
    transition: 0.2s;
  }

  .toggler {
    height: 16px;
    width: 16px;
    margin: 0px 2px;
    border-radius: 50%;
    background-color: #fefefe;
    transition: 0.2s;
  }

  .on {
    justify-content: flex-end;
    background-color: #54bdb4;
  }
</style>
