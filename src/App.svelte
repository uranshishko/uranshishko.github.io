<script>
  import Container from "./components/Container.svelte";

  if (isMobile && screen && screen.orientation && screen.orientation.lock)
    screen.orientation.lock("portrait");

  let x = 0,
    y = 0;

  $: positioning = {
    top: y + "px",
    left: x + "px",
  };

  $: cssPositioning =
    Object.entries(positioning)
      .map(([key, value]) => `${key}: ${value}`)
      .join("; ") + ";";

  $: isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
</script>

<main
  on:mousemove={(e) => {
    x = e.clientX;
    y = e.clientY;
  }}
>
  <Container />
  {#if !isMobile}
    <div
      class="mouse_decor_circle {x === 0 ? 'hide' : ''}"
      style={cssPositioning}
    />
    <div
      class="mouse_decor_ball {x === 0 ? 'hide' : ''}"
      style={cssPositioning}
    />
  {/if}
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    background: url("../assets/BKG.jpg"), #222222;
    background-blend-mode: lighten;
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mouse_decor_circle {
    height: 40px;
    width: 40px;
    border: 1px solid #54bdb49f;
    border-radius: 50%;
    transition: 0.15s;
    transform: translate(-50%, -50%);
    position: absolute;
    pointer-events: none;
  }

  .mouse_decor_ball {
    height: 20px;
    width: 20px;
    background-color: #54bdb49f;
    border-radius: 50%;
    transition: 0.1s;
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .hide {
    display: none;
  }

  @media (max-width: 800px) {
    main {
      background: #222222;
    }
  }
</style>
