// form validation
const search_bar = document.getElementById("search-bar");
const search_sug = document.querySelector(".search-suggest");
const search_delete = document.querySelector('.search-bar-cont .fa-circle-xmark');

const location_inp = document.getElementById("location-inp");
const location_sug = document.querySelector(".location-suggest");
const location_delete = document.querySelector('.location-inp-cont .fa-circle-xmark');

const search_btn = document.querySelector(".search_btn");

// ======  nav  ======

window.addEventListener("scroll", () => {
    if(document.querySelector("main").style.display !== "none") {
        if (scrollY >= 100) {
            nav_sec.classList.add("nav-sec-active");
        } else {
            nav_sec.classList.remove("nav-sec-active");
        }
    }
});


// ======  fetch data  ======
const req = new XMLHttpRequest();

req.onload = function () {
    let data_obj = JSON.parse(req.responseText);

// ===== custom search select ======
    
    // === locations  ===
    const locations = new Set();
    let location_items;
    let custom_select_trig = false;

    data_obj.data.forEach(ele => {
        locations.add(ele.location);;
    });

    location_inp.onfocus = function () {
        remove_list_search();
    }


    location_inp.oninput = function () {
        if (!custom_select_trig) {
            custom_select();
            location_items = document.querySelectorAll(".location-suggest li");
            // set inp_value from select items 
            location_items.forEach(ele => {
                ele.onclick = function () {
                    location_inp.value = ele.getAttribute("location-value");
                    location_items.forEach(el => {el.remove();});
                }
            });
        }
    // close icon

        location_delete.style.display = "block";

        search_select();
        
        custom_select_trig = true;

        if (this.value === "") {
            remove_list();
            custom_select_trig = false;
            location_delete.style.display = "none";
        }

    // global functions
        function custom_select() {
            locations.forEach((ele) => {
                let opt = document.createElement("li");
                opt.className = "p-2";
                opt.setAttribute("location-value", ele);
                opt.textContent = ele;

                location_sug.style.display = "block";
                location_sug.append(opt);
            });

        }

        function search_select() {
            const location_values = [];
            location_items.forEach((ele) => { location_values.push(ele.getAttribute("location-value")) });

            const res = [];
            let search_key = new RegExp(location_inp.value, "i")

            location_values.forEach((ele, i) => {
                if (ele.search(search_key) === -1) {
                    res.push(i);
                }
            });

            for (let i of res) {
                location_items[i].remove();
            }
        }

    }

    location_delete.onclick = function () {
        location_inp.value = "";
        this.style.display = "none";
        remove_list();
        custom_select_trig = false
    }


// === search bar
    
    const jobs = new Set();
    let jobs_items;
    let custom_select_trig_search = false;


    data_obj.data.forEach(ele => {
        jobs.add(ele.title);
    });

    search_bar.onfocus = function () {
        remove_list();
    }

    search_bar.oninput = function () {
        if (!custom_select_trig_search) {
            custom_select_search();
            jobs_items = document.querySelectorAll(".search-suggest li");
            // set inp_value from select items 
            jobs_items.forEach(ele => {
                ele.onclick = function () {
                    search_bar.value = ele.getAttribute("job-value");
                    jobs_items.forEach(el => {el.remove();});
                }
            });
        }
        // delete icon
        search_delete.style.display = "block";

        search_select_search();
        
        custom_select_trig_search = true;

        if (this.value === "") {
            remove_list_search();
            search_delete.style.display = "none";
            custom_select_trig_search = false;
        }


    // global functions
        function custom_select_search() {
            jobs.forEach((ele) => {
                let opt = document.createElement("li");
                opt.className = "p-2";
                opt.setAttribute("job-value", ele);
                opt.textContent = ele;

                search_sug.style.display = "block";
                search_sug.append(opt);
            });
        }

        function search_select_search() {
            const search_values = [];
            jobs_items.forEach((ele) => { search_values.push(ele.getAttribute("job-value")) });

            const res = [];
            let search_key = new RegExp(search_bar.value, "i")

            search_values.forEach((ele, i) => {
                if (ele.search(search_key) === -1) {
                    res.push(i);
                }
            });

            for (let i of res) {
                jobs_items[i].remove();
            }
        }

    }

    search_delete.onclick = function () {
        search_bar.value = "";
        this.style.display = "none";
        remove_list_search();
        custom_select_trig_search = false
    }

// ==== stats  ====
    const stats = document.querySelectorAll('.stats-item strong');
    const companies_state = document.querySelector(".stats-item .companies-state");
    const jobs_state = document.querySelector(".stats-item .jobs-state");
    const users_state = document.querySelector(".stats-item .users-state");

    const companies_num = new Set();

    data_obj.data.forEach((ele) => {
        companies_num.add(ele.company_name);
    });
    // set target
    jobs_state.setAttribute("target", data_obj.data.length);
    users_state.setAttribute("target", 300);
    companies_state.setAttribute("target", companies_num.size);
    // on scrolling function
    window.addEventListener('scroll', () => {
        if (scrollY >= 200 && scrollY <= 1000) {
            
            stats.forEach(ele => {
                let target = ele.getAttribute("target");

                const increase_fun = setInterval(() => {
                    if (ele.textContent == ele.getAttribute("target")) {
                        clearInterval(increase_fun)
                    } else {
                        ele.textContent++;
                    }
                }, 500 / +target);

            });

        } else {
            stats.forEach(ele => { ele.textContent = 0 });
        }
    });

// ==== search ====
    const jobs__header_heading = document.querySelector(".jobs__header h1");
    const results_num = document.querySelector(".results_num");
    const search_results = document.querySelector(".search_results");
    const job_details = document.querySelector(".job__details");
    const job_details_header = document.querySelector(".job__details__header");

    search_btn.onclick = function() {
        // Render Jobs
        if(!search_bar.value && !location_inp.value) {
            window.location.href = "HTML/all_jobs.html";
        } else {
            results_page();
            data_obj.data.forEach((ele, i) => {
                if(location_inp.value === ele.location && !search_bar.value) {
                    
                    cr_job(ele, i);

                } else if(search_bar.value === ele.title && !location_inp.value) {
                    
                    cr_job(ele, i);

                } else if(search_bar.value === ele.title && location_inp.value === ele.location) {
                    
                    cr_job(ele, i);

                }
            });
        }
        // set num of results and heading
        function location_values() {
            if(!location_inp.value) {
                return 'Germany';
            } else{
                return location_inp.value;
            }
        }

        function search_values() {
            if(!search_bar.value) {
                return 'All jobs';
            } else{
                return search_bar.value;
            }
        }

        const jobs_items = document.querySelectorAll(".job");
        results_num.textContent = `${jobs_items.length} Results`;

        jobs__header_heading.textContent = `${search_values()} in ${location_values()}`;

        if(jobs_items.length < 10) {
            document.querySelector(".search_results").style.height = "100vh"
        }

        // No results alert
        if(jobs_items.length === 0) {
            search_results.innerHTML = `
            <div class="display-3">No Results</div>
            <a href="HTML/all_jobs.html" class="text-decoration-none mt-5 display-6">See All Jobs</a>
            `;
            search_results.classList.add("no_results");
        } else{
             //active job
            jobs_items[0].classList.add("job-active");
            jobs_items.forEach((ele) => {
                ele.addEventListener("click", (e) => {
                    jobs_items.forEach(ele => {ele.classList.remove("job-active")});
                    e.currentTarget.classList.add("job-active");
                });
            });
        }

        //active  details
        let job_description = document.createElement("div");

        jobs_items.forEach((ele, i) => {
            if(ele.classList.contains("job-active")) {
                let job_id = ele.getAttribute("job-id");

                job_description.innerHTML = data_obj.data[+job_id].description;

                cr_job_details_header(job_id);
                job_details.setAttribute("job-id", job_id);
                job_details.append(job_description);
            }
        });

        jobs_items.forEach((ele) => {
            ele.addEventListener("click", (e) => {
                let job_id = e.currentTarget.getAttribute("job-id");

                job_description.innerHTML = data_obj.data[+job_id].description;

                cr_job_details_header(job_id);
                job_details.setAttribute("job-id", job_id);
                job_details.append(job_description);
                
            });
        });

        jobs_items.forEach((ele) => {
            ele.addEventListener("click", (e) => {
                if(innerWidth <= 991) {
                    job_details.classList.add("job__details__mobile");
                    document.querySelector(".jobs").style.display = "none";

                    if(job_details.classList.contains("job__details__mobile")) {

                        document.querySelector(".back").style.display = "block";

                        document.querySelector(".back .fa-arrow-left").addEventListener("click", () => {
                            job_details.classList.remove("job__details__mobile");
                            document.querySelector(".jobs").style.display = "block";
                        });
                    }
                }
            });
        });

        window.addEventListener("resize", () => {
            if(innerWidth > 991) {
                job_details.classList.remove("job__details__mobile");
                document.querySelector(".jobs").style.display = "block";
            } else{
                document.querySelector(".back").style.display = "block";
            }
        });
    }

    // ==== save jobs ====

    
// functions
    function remove_list_search() {
        jobs_items = document.querySelectorAll(".search-suggest li");
        if (jobs_items) {
            jobs_items.forEach((ele) => {
                ele.remove();
            });
        }
        search_sug.style.display = "none";
    }

    function remove_list() {
        location_items = document.querySelectorAll(".location-suggest li");
        if (location_items) {
            location_items.forEach((ele) => {
                ele.remove();
            });
        }
        location_sug.style.display = "none";
    }

    function results_page() {
        document.querySelector("main").style.display = "none";
        document.querySelector(".page-style").setAttribute("href", "style/pages/all_jobs/all_jobs.css");
        search_results.style.display = "flex";
        document.querySelector("section").classList.add("nav-sec-active");
    }

    function cr_job(element, i) {
        let job_div = document.createElement("div");
        job_div.className = "job py-2 px-2";
        job_div.setAttribute("job-id", i);

        function remote_or_site() {
            if (element.remote) {
                return "(Remote)";
            } else {
                return "(on site)";
            }
        }

        job_div.innerHTML = `
        <div>
            <img src="images/company.svg" class="col-2" alt="company-logo">
            <div class="job_title pb-1">
            <h3>${element.title}</h3>
            <h4>${element.company_name}</h4>
            <div>
                <span>${element.location}</span>
                <span class="remote">${remote_or_site()}</span>
            </div>
            </div>
        </div>
        `; 
        document.querySelector(".jobs__cont").append(job_div);

    }

    function cr_job_details_header(i) {

        function remote_or_site() {
            if (data_obj.data[i].remote) {
                return "(Remote)";
            } else {
                return "(on site)";
            }
        }

        job_details_header.innerHTML = `
        <h3>${data_obj.data[i].title}</h3>
        <h4>${data_obj.data[i].company_name}</h4>
        <div class='mb-4'>
            <span>${data_obj.data[i].location}</span>
            <span class="remote">${remote_or_site()}</span>
        </div>
        <a href="${data_obj.data[i].url}" target="_blank" class="btn text-decoration-none px-4">Apply Now</a>
        <i class="fa-solid col fa-bookmark saved-ico"></i>
        <div class="back">
            <i class="fa-solid fa-arrow-left"></i>
        </div>
        `;

        // save items
        let saved_ico = document.querySelector(".saved-ico");

        saved_ico.addEventListener("click", () => {
            saved_ico.classList.toggle("saved");
        });

    }

}

req.open("GET", "https://www.arbeitnow.com/api/job-board-api");
req.send();
