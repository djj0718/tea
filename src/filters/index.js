export function rmb (price) {
    return `￥${(price / 100).toFixed(2)}`
}