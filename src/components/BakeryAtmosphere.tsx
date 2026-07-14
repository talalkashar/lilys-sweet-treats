/**
 * Sitewide bakery backdrop — soft and readable, inspired by Dolce Amore:
 * clean cream field, faint cupcake pattern, no busy motion.
 */
export function BakeryAtmosphere() {
  return (
    <>
      <div className="site-wallpaper" aria-hidden>
        <div className="site-wallpaper-layer" />
      </div>
      <div className="site-wallpaper-veil" aria-hidden />
    </>
  );
}
