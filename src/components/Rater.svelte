<script>
  export let level = 0;
  export let max = 5;
</script>

<div class="rater">
  {#each Array(max) as _, i (i)}
    <div class="dot {i + 1 <= level ? 'active' : ''}" />
  {/each}
</div>

<style>
  .rater {
    width: 100px;
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 8px;
  }

  .dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: #222222;
  }

  .active {
    background-color: #54bdb4;
  }
</style>
