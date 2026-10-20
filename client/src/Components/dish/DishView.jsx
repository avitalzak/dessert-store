import DishVisualizer from "./DishVisualizer"
import PhotoDish from "./PhotoDish"
import { useManifest, photoDishFor } from "./photoScene"

// בוחר איך להציג את המנה: אם יש לה תמונות אמיתיות - מנה מצולמת,
// אחרת - האיור המצויר (עד שיהיו תמונות גם לה).
// final: בשייק (בסיכום) - לערבל את הפירות והנוזל לכוס שייק מוכנה.
export default function DishView(props) {
    const manifest = useManifest()
    if (!manifest) return <div className="pd-loading" />
    if (photoDishFor(props.product, manifest)) return <PhotoDish {...props} manifest={manifest} />
    return <DishVisualizer {...props} />
}
