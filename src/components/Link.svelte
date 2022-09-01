<script>
  export let href;
  export let alt;
  export let icon;
  export let text;
  export let size;

  $: fontSize = `font-size: ${size}px;`;
</script>

<a
  href={href ? href : "#"}
  alt={alt ? alt : ""}
  style={size ? fontSize : ""}
  target="_blank"
>
  {#if icon}
    <i class={icon} />
  {/if}
  {text ? text : ""}
</a>
