import gsap from "gsap"

(() => {
    document.querySelectorAll("#popup-customer .box").forEach((el, i) => {
        gsap.fromTo(el,
            {
                display: "hidden",
                autoAlpha: 0,
            },
            {
                display: "block",
                autoAlpha: 1,
                duration: .4
                // delay: i*2000
            }, i*3
        )
        el.addEventListener("click", () => {
            el.classList.add('hidden')
        })
    })
})()