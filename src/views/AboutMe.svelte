<script>
  import { t, locale } from "../i18n";
  import { socialMediaLinks } from "../stores";

  import BaseLayout from "../components/BaseLayout.svelte";

  function scrollHandler(e) {
    let { scrollTop } = e.target;

    if (!scrollTop) {
      shadow = false;
      return;
    }

    shadow = true;
  }

  let shadow = false;
</script>

<BaseLayout title={$t("aboutme.title")}>
  <div class="content">
    <div
      class="content_info details rounded {shadow ? 'details_shadow' : ''}"
      on:scroll={scrollHandler}
    >
      <section lang={$locale}>
        <p style="text-shadow: 1px 1px #111">
          <i>{$t("aboutme.intro.title")}</i>
        </p>
        <p
          style="text-align: justify; text-justify: inter-word; hyphens: auto; text-shadow: 1px 1px #111"
        >
          {@html $t("aboutme.intro.description")}
        </p>
      </section>
      <img src="./assets/coder.svg" alt="coder illustration" width="100%" />
    </div>
    <div class="content_info general rounded">
      <div>
        <div class="frame">
          <img
            width="80%"
            loading="lazy"
            src="./assets/pic.png"
            alt="profile_picture"
          />
        </div>
        <div class="info">
          <h2>Uran Shishko</h2>
          <div class="social_media">
            {#each $socialMediaLinks as item, i (i)}
              <a href={item.link} alt={item.desc} target="_blank">
                <i class={item.icon} />
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .content {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap-reverse;
    overflow: hidden;
    gap: 0px;
  }

  .content_info {
    flex: 50%;
  }

  .general {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #222222;
    overflow-y: scroll;
  }

  .general > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .info > * {
    margin-bottom: 0px;
  }

  .frame {
    min-height: 50px;
    min-width: 50px;
    max-height: 150px;
    max-width: 150px;
    border-radius: 50%;
    background-color: black;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #54bdb4;
  }

  .frame img {
    height: auto;
    object-fit: contain;
  }

  .social_media {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 130px;
  }

  .details {
    padding: 0px 26px 18px 18px;
    overflow-y: scroll;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    overflow-y: scroll;
  }

  @media (max-width: 800px) {
    .content_info {
      flex: 100%;
      height: 50%;
    }

    .details {
      padding: 16px;
    }

    .details_shadow {
      box-shadow: inset 0px 16px 12px -15px #222222;
    }
  }
</style>
