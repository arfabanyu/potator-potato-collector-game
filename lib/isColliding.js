export function isColliding(a, b) {
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    return distance < a.size + b.size;
}