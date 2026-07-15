/**
 * Sitewide bakery backdrop from client brand assets:
 * purple cupcake wall + soft line-art cupcakes under a cream veil.
 */
export function BakeryAtmosphere() {
  return (
    <>
      <div className="site-wallpaper" aria-hidden>
        <div className="site-wallpaper-layer" />
        <div className="site-wallpaper-layer site-wallpaper-layer--soft" />
      </div>
      <div className="site-wallpaper-veil" aria-hidden />
    </>
  );
}
