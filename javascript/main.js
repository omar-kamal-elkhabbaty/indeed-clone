// ======== load page ========
window.addEventListener('beforeunload', () => {
    document.body.classList.add("load-body");
});

document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.body.classList.add("load-body");
    } else {
        document.body.classList.remove("load-body");
    }
}

// ========  Nav bar  ========
const nav_sec = document.querySelector("section");
const nav_items = document.querySelectorAll("nav ul.col-5 li");
const nav_icons = document.querySelector("nav div.col-2");
const list_ico = document.querySelector("i.fa-bars");
const mobile_list = document.querySelector(".mobile-list");
const close_ico = document.querySelector(".fa-xmark");
let blur_div = document.createElement("div");

    // responsive nav
if (innerWidth <= 576) {
    nav_icons.classList.remove("col-2");
    nav_icons.classList.add("col-4");
} else{
    nav_icons.classList.add("col-2");
    nav_icons.classList.remove("col-4");
}

function mobile_list_handle() {
    if (window.innerWidth <= 991) {
        list_ico.addEventListener("click", () => {
            blur_div.classList.add("blur-div");
            document.body.append(blur_div);
            document.body.classList.add("blur-body");

            mobile_list.classList.remove("d-none", "mobile-list-hide")
            mobile_list.classList.add("mobile-list-display");
        
            
        });
        
        close_ico.addEventListener("click", () => {
            
            mobile_list.classList.remove('mobile-list-display');
            mobile_list.classList.add("mobile-list-hide");
            
            blur_div.remove();
            document.body.classList.remove("blur-body");

        });
    } else {
        mobile_list.classList.add("d-none");
        blur_div.remove();
        document.body.classList.remove("blur-body");
    } 
}

mobile_list_handle();

    // on resizing
window.onresize = function () {
    // list
    mobile_list_handle();
    // nav response
    if (innerWidth <= 576) {
        nav_icons.classList.remove("col-2");
        nav_icons.classList.add("col-4");
    } else{
        nav_icons.classList.add("col-2");
        nav_icons.classList.remove("col-4");
    }
}

// ======= dark and light theme  ========
const root = document.querySelector('html');
const theme_ico = document.querySelector("#theme-ico");
const theme_file = document.querySelector("#theme-file");
const logo = document.querySelector(".logo");
const logo_menu = document.querySelector(".logo-menu");
const logo_loading = document.querySelector(".loading-page img");

function themes() { 

    let theme_color;

    if (localStorage.getItem("theme-color")) {
        theme_color = localStorage.getItem("theme-color");
    } else {
        theme_color = "dark";
    }

    root.setAttribute("theme", theme_color);

    if (theme_color === "dark") {
        dark_fun();
    } else {
        light_fun();
    }


    theme_ico.onclick = function () {

    if (root.getAttribute("theme") === "dark") {
        root.setAttribute("theme", 'light');
    } else {
        root.setAttribute("theme", "dark");
    }

    localStorage.setItem("theme-color", root.getAttribute("theme"));
    
    theme_color = root.getAttribute("theme");

        if (theme_color === "dark") {
            dark_fun();
        } else {
            light_fun();
        }
    
    }

    function dark_fun() {
        theme_ico.classList.add('fa-sun');
        theme_ico.classList.remove('fa-moon');

        theme_file.href = `${theme_file.getAttribute("path-dir")}style/global/dark_vars.css`;

        logo.src = `${logo.getAttribute("path-dir")}images/logo-dark.png`;
        logo_loading.src = `${logo_loading.getAttribute("path-dir")}images/logo-dark.png`;
        logo_menu.src = `${logo_menu.getAttribute("path-dir")}images/logo-dark.png`;
    }

    function light_fun() {
        theme_ico.classList.remove('fa-sun');
        theme_ico.classList.add('fa-moon');
        
        theme_file.href = `${theme_file.getAttribute("path-dir")}style/global/light_vars.css`;

        logo.src = `${logo.getAttribute("path-dir")}images/logo.png`;
        logo_loading.src = `${logo_loading.getAttribute("path-dir")}images/logo.png`;
        logo_menu.src = `${logo_menu.getAttribute("path-dir")}images/logo.png`;
    }

}

themes();

// ===== save jobs =====
let saved_jobs_id = new Set();

if(localStorage.getItem("saved-jobs-id")) {
    saved_jobs_id = new Set(JSON.parse(localStorage.getItem("saved-jobs-id")));
}

// search page
if(location.pathname.includes("index")) {
    const search_btn = document.querySelector(".search_btn");
    
    search_btn.addEventListener("click", () =>{
        // fetch data
        const search_req = fetch("https://www.arbeitnow.com/api/job-board-api").then((res) => res.json());

        search_req.then((res) => {
            //access on jobs after loading 
            const jobs = document.querySelectorAll(".job");
            const job__details = document.querySelector(".job__details");

            // onload
            save_icon_handle();
            active_saved_jobs();
            // onchange
            if(jobs) {
                jobs.forEach((ele) => {
                    ele.addEventListener("click", () => {
                        save_icon_handle();
                        active_saved_jobs();
                    });
                });
            }

        // functions
            function save_icon_handle() {
                const saved_ico = document.querySelector(".saved-ico");

                if(saved_ico) {
                    let job_id = saved_ico.parentElement.parentElement.getAttribute("job-id");

                    saved_ico.addEventListener("click", () => {
                        if(saved_ico.classList.contains("saved")) {
                            saved_jobs_id.add(job_id);
                        } else{
                            saved_jobs_id.delete(job_id);
                        }

                        localStorage.setItem("saved-jobs-id", JSON.stringify([...saved_jobs_id]));
                        
                    });
                }
            }

            function active_saved_jobs() {
                let updated_jobs_id = new Set(JSON.parse(localStorage.getItem("saved-jobs-id")));
                        
                if(job__details.classList.contains("job__details__mobile") || job__details) {
                    updated_jobs_id.forEach((ele) => {
                        if(ele == job__details.getAttribute("job-id")) {
                            document.querySelector(".saved-ico").classList.add("saved");
                        }
                    });
                }
            }

        });

    });
} 
