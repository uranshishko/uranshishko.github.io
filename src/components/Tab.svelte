<script>
  export let clickHandler;
  export let isActive = false;
</script>

<button on:click={clickHandler} class="tab {isActive ? 'active' : ''}">
  <slot />
</button>

<style>
  .tab {
    background-color: #232625;
    border: none;
    color: #54bdb4;
    height: 50px;
    width: 50px;
    transition: 0.2s;
    font-size: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .tab:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  .active {
    background-color: #54bdb4;
    color: #232625;
  }

  @media (max-width: 800px) {
    .tab {
      width: 100%;
    }
  }
</style>
