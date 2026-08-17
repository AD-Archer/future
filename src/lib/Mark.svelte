<script>
  // The dolphin, sitting on a glossy surface with its reflection under it.
  //   <Mark size={300} />
  //
  // The mirrored fade beneath an object is the single most 2005 device there
  // is — every product shot, app icon and Web 2.0 header had one. It is also
  // what makes a flat drawing sit *on* a page instead of floating over it.
  let { size = 300, reflect = true } = $props()
</script>

<div class="mark" class:reflect style="--s:{size}px">
  <img src="/dolphin.webp" alt="" width="500" height="500" />
</div>

<style>
  .mark {
    position: relative;
    width: var(--s);
    max-width: 100%;
  }

  .mark img {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 10px 14px rgba(12, 52, 90, 0.32));
  }

  /* Chromium/WebKit get a true reflection; elsewhere the mark simply stands
     on its own, which is a fine outcome rather than a broken one. The mask
     runs from the edge touching the object outward, so the strong stop goes
     first — reversed, it paints a ghost of the mark far below it. A reflection
     also paints outside the box and adds no height, so any caller has to
     reserve room for it. */
  .reflect img {
    -webkit-box-reflect: below 1px
      linear-gradient(to bottom, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.06) 30%, transparent 52%);
  }
</style>
