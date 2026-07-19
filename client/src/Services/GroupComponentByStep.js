export function groupComponentsByStep(components) {
    const groupedComponents = {}

    components?.forEach(component => {
        if (component) {
            const groupTitle = component.stepTitle || "רכיבים"
            if (!groupedComponents[groupTitle]) groupedComponents[groupTitle] = []
            groupedComponents[groupTitle].push(component.label)
        }
    })

    return groupedComponents
}