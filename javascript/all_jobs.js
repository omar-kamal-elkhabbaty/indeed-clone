const jobs_cont = document.querySelector(".jobs__cont");
const jobs_details = document.querySelector(".job__details");
const jobs_pagination = document.querySelector(".jobs__pagination ul");
const jobs_header_results = document.querySelector('.jobs__header span');


// save in local storage
let saved_jobs = new Set();

if(localStorage.getItem("saved-jobs-id")) {
    saved_jobs = new Set(JSON.parse(localStorage.getItem("saved-jobs-id")));
}

const req = fetch("https://www.arbeitnow.com/api/job-board-api");

req.then((res) => res.json())
    .then((res) => {
        
        const data = res.data;

    //==== num of results  ====
        jobs_header_results.textContent = data.length + " Results";
        
    // ==== pagination ====
        for (let i = 1; i <= Math.ceil(data.length / 20); i++) {
            let pag_item = document.createElement("li");
                pag_item.setAttribute("value", i);
                //pag_item.textContent = i;

                pag_item.innerHTML = `
                    <a href="#jobs_header" class='text-decoration-none'>${i}</a>
                `

            jobs_pagination.append(pag_item);
        }

        const pag_items = document.querySelectorAll(".jobs__pagination ul li");
        //set active class onload
        pag_items.forEach((ele) => {
            if (ele.getAttribute("value") === "1") {
                ele.className = "active-pag";
            }
        });
        //set active class onclick
        pag_items.forEach((ele) => {
            ele.addEventListener('click', (e) => {
                pag_items.forEach((el) => { el.classList.remove("active-pag") });
                e.currentTarget.classList.add("active-pag");
                e.currentTarget.children[0].click();
            });
        });

    // render data
        let group = 1;

        const jobs_data = [];
        // create jobs items and set group, id attr
        for (let i = 0; i < data.length; i++) {

            let job_div = document.createElement("div");
            job_div.className = "job py-2 px-2";
            job_div.setAttribute("job-id", i);
            job_div.setAttribute("job-group", group);

            function remote_or_site() {
                if (data[i].remote) {
                    return "(Remote)";
                } else {
                    return "(on site)";
                }
            }

            job_div.innerHTML = `
            <div>
                <img src="../images/company.svg" class="col-2" alt="company-logo">
                <div class="job_title pb-1">
                <h3>${data[i].title}</h3>
                <h4>${data[i].company_name}</h4>
                <div>
                    <span>${data[i].location}</span>
                    <span class="remote">${remote_or_site()}</span>
                </div>
                </div>
            </div>
            `;

            jobs_data.push(job_div);

            if(i > 1) {
                if((i % 20) === 0) {
                    group++;
                }
            }
        }

        // connect items with pagination
        let active_pag = document.querySelector("li.active-pag");

            // onload
        jobs_data.forEach((ele) => {
            if (ele.getAttribute("job-group") === active_pag.getAttribute("value")) {
                jobs_cont.append(ele);
            } else {
                ele.remove();
            }
        });
            // onclick
        pag_items.forEach((ele) => {
            ele.addEventListener('click', (e) => {

                jobs_data.forEach((ele) => {
                    if (ele.getAttribute("job-group") === e.currentTarget.getAttribute("value")) {
                        jobs_cont.append(ele);
                    } else {
                        ele.remove();
                    }
                });

            });
        });

        //items functions
        const jobs_items = document.querySelectorAll(".job");
        // active job onload
        window.addEventListener("load", () => {
            if(jobs_items) {
                jobs_items[0].classList.add("job-active");
            }
        });

        jobs_items[0].classList.add("job-active");

        //onchange
        jobs_items.forEach((ele) => {
        ele.addEventListener("click", (e) => {
            jobs_items.forEach((ele) => {ele.classList.remove("job-active")});
            e.currentTarget.classList.add("job-active");
            });
        });
        
        // active job onchange
        pag_items.forEach((ele) => {
            ele.addEventListener("click", () => {
                const jobs_items = document.querySelectorAll(".job");
                if(jobs_items) {
                    //onload
                    jobs_items[0].classList.add("job-active");
                    //onchange
                    jobs_items.forEach((ele) => {
                        ele.addEventListener("click", (e) => {
                            jobs_items.forEach((ele) => {ele.classList.remove("job-active")});
                            e.currentTarget.classList.add("job-active");
                        });
                    });
                }
            });
        });

    // job-details

    function cr_job__details(el) {

        function remote_or_site() {
            if (data[el].remote) {
                return "(Remote)";
            } else {
                return "(on site)";
            }
        }

        if(jobs_items) {
            let job__details__header = document.createElement("div");
            job__details__header.classList.add("job__details__header", "py-4");
            job__details__header.innerHTML = `
            <h3>${data[el].title}</h3>
            <h4>${data[el].company_name}</h4>
            <div class='mb-4'>
                <span>${data[el].location}</span>
                <span class="remote">${remote_or_site()}</span>
            </div>
            <a href="${data[el].url}" target="_blank" class="btn text-decoration-none px-4">Apply Now</a>
            <i class="fa-solid col fa-bookmark saved-ico"></i>
            <div class="back">
                <i class="fa-solid fa-arrow-left"></i>
            </div>
            `;

            jobs_details.prepend(job__details__header);
            // responsive
            if(innerWidth <= 991) {
                jobs_items.forEach((ele) => {
                    ele.addEventListener("click", () => {
                        jobs_details.classList.add("job__details__mobile");
                        document.querySelector(".jobs").style.display = "none";
                        document.querySelector(".back").style.display = "block";

                        document.querySelector(".back").addEventListener("click", () => {
                            jobs_details.classList.remove("job__details__mobile");
                            document.querySelector(".jobs").style.display = "block";

                        });
                    });
                });

            } else {
                jobs_items.forEach((ele) => {
                    ele.addEventListener("click", () => {
                        jobs_details.classList.remove("job__details__mobile");
                        document.querySelector(".jobs").style.display = "block";
                    })
                });
            }

            window.addEventListener("resize", () => {
                if(innerWidth > 991) {
                    jobs_items.forEach((ele) => {
                        ele.addEventListener("click", () => {
                            jobs_details.classList.remove("job__details__mobile");
                            document.querySelector(".jobs").style.display = "block";
                        })
                    });
                }
            })
            // save items
            let saved_ico = document.querySelector(".saved-ico");

            // active icon
            saved_ico.addEventListener("click", () => {
                saved_ico.classList.toggle("saved");
            });
            
            //save jobs
            let job_id = saved_ico.parentElement.parentElement.getAttribute("job-id");
            let job__details = document.querySelector(".job__details");

            saved_ico.addEventListener("click", () => {
                if(saved_ico.classList.contains("saved")) {
                    saved_jobs.add(job_id);
                } else{
                    saved_jobs.delete(job_id);
                }

                localStorage.setItem("saved-jobs-id", JSON.stringify([...saved_jobs]));

            });

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

            active_saved_jobs();

        }

    }

    
    window.addEventListener("load", () => {
        job__details_render();
    });
    
    function job__details_render() {
        const jobs_items = document.querySelectorAll(".job");
        if(jobs_items) {
            jobs_items.forEach((ele) => {
                if(ele.classList.contains("job-active")) {
                    jobs_details.innerHTML = data[+ele.getAttribute("id")].description;
                    jobs_details.setAttribute("job-id", +ele.getAttribute("id"));
                    cr_job__details(+ele.getAttribute("job-id"));
                }
            });
        }
    }
    
    job__details_render();

    jobs_items.forEach((ele) => {
        ele.addEventListener("click", () => {
            jobs_details.innerHTML = data[+ele.getAttribute("job-id")].description;
            jobs_details.setAttribute("job-id", +ele.getAttribute("job-id"));
            cr_job__details(+ele.getAttribute("job-id"));
        });
    });

    pag_items.forEach((ele) => {
        ele.addEventListener("click", () => {
            const jobs_items = document.querySelectorAll(".job");

            if(jobs_items) {

                jobs_items.forEach((ele) => {
                    if(ele.classList.contains("job-active")) {
                        jobs_details.innerHTML = data[+ele.getAttribute("job-id")].description;
                        jobs_details.setAttribute("job-id", +ele.getAttribute("job-id"));
                        cr_job__details(+ele.getAttribute("job-id"));
                    }
                    ele.addEventListener("click", (e) => {
                        let act_item =  e.currentTarget;
                        jobs_details.innerHTML = data[+act_item.getAttribute("job-id")].description;
                        jobs_details.setAttribute("job-id", +act_item.getAttribute("job-id"));
                        cr_job__details(+act_item.getAttribute("job-id"));
                    });
                });

                if(innerWidth <= 991) {
                    jobs_items.forEach((ele) => {
                        ele.addEventListener("click", () => {
                            jobs_details.classList.add("job__details__mobile");
                            document.querySelector(".jobs").style.display = "none";
                            document.querySelector(".back").style.display = "block";
    
                            document.querySelector(".back").addEventListener("click", () => {
                                jobs_details.classList.remove("job__details__mobile");
                                document.querySelector(".jobs").style.display = "block";
    
                            });
                        });
                    });
    
                }

            }
        });
    });

    window.addEventListener("resize", () => {
        if(innerWidth > 991) {
            jobs_details.classList.remove("job__details__mobile");
            document.querySelector(".jobs").style.display = "block";
            document.querySelector("div.back").style.display = "none";
        }
    });

});
