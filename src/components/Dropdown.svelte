<script>
  import Rater from "./Rater.svelte";
  export let title = "TITLE";
  export let items = [];
</script>

<details class="web_dev_details rounded shadow">
  <summary>{title}</summary>
  <div class="rounded">
    <ul>
      {#each items as item, i (i)}
        <li>
          <span>
            {#if item.icon}
              <i class={item.icon} />&nbsp;
            {/if}
            {item.text}
          </span>
          <Rater level={item.level} />
        </li>
      {/each}
    </ul>
  </div>
</details>

<style>
  details {
    width: 100%;
    padding: 8px;
    transition: 0.2s;
    background-color: #232625;
  }

  summary {
    font-weight: bold;
    padding: 10px;
  }

  details[open] summary {
    margin-bottom: 20px;
  }

  details,
  details * {
    user-select: none;
  }

  details div {
    background-color: #2f2f2f;
    overflow: hidden;
  }

  details div ul {
    height: 100%;
    width: 100%;
    margin: 2px;
    padding: 0px;
  }

  details div ul li {
    list-style: none;
    padding: 4px 8px;
    margin-bottom: 2px;
    border-bottom: 1px solid #222;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  @media (max-width: 8000px) {
    details div ul li {
      font-size: 16px;
    }
  }
</style>
