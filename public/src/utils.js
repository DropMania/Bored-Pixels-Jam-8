export let sleep = (time) => {
    return new Promise((res) => setTimeout(res, time))
}
