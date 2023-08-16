const main_content = document.querySelector("main");
const job_details = document.querySelector(".job__details");
const my_jobs = document.querySelector(".my_jobs");
const no_items = document.querySelector(".no_items");
const my_jobs_num = document.querySelector(".my_jobs_num span");
const all_jobs_num = document.querySelector(".all_jobs_num span");

let my_jobs_id = new Set(JSON.parse(localStorage.getItem("saved-jobs-id")));
const req = fetch("https://www.arbeitnow.com/api/job-board-api").then(res => res.json());

// ==== render data ====
req.then(res => {
    const data_obj = res.data;
    // jobs stats
    my_jobs_num.textContent = my_jobs_id.size;
    all_jobs_num.textContent = data_obj.length;
    // render jobs
    my_jobs_id.forEach((ele) => {
        let job_item = document.createElement("div");
        job_item.classList.add("job_item", "p-3");
        job_item.setAttribute("job-id", ele)

        function remote_or_not() {
            if(data_obj[ele].remote) {
                return "Remote";
            } else{
                return "On Site";
            }
        }

        job_item.innerHTML = `
        <img src="../images/company.svg" alt="company-logo">
        <div class="job_info">
        <h3>${data_obj[ele].title}</h3>
        <h4>${data_obj[ele].company_name}</h4>
        <div class="location">${data_obj[ele].location} <span>(${remote_or_not()})</span></div>
        </div>
        `;

        my_jobs.append(job_item);

    });

    //no items
    if(my_jobs_id.size === 0) {
        my_jobs.remove();
        no_items.style.display = "flex";
    } else{
        no_items.style.display = "none";
    }
    // responsive
    const jobs = document.querySelectorAll(".job_item");

    if(jobs.length < 4) {
        main_content.style.height = "100vh";
    } else{
        main_content.style.height = "auto";
    }

    mobile_response();

    window.addEventListener("resize", () => {
        mobile_response()
    });

    function mobile_response() {
        if(innerWidth <= 991) {
            main_content.style.height = "auto";
        }
    }

    //job details
    jobs.forEach((ele) => {
        ele.addEventListener("click", () => {
            let the_job = data_obj[+ele.getAttribute("job-id")]; 

            main_content.style.display = "none";
            job_details.style.display = 'block';

            job_details.setAttribute("job-id", +ele.getAttribute("job-id"));

            function remote_or_not() {
                if(the_job.remote) {
                    return "Remote";
                } else{
                    return "On Site";
                }
            }

            let job__details__header = document.createElement("div");
            job__details__header.classList.add("job__details__header", "py-4");
            job__details__header.innerHTML = `
            <h3>${the_job.title}</h3>
            <h4>${the_job.company_name}</h4>
            <div class='mb-4'>
                <span>${the_job.location}</span>
                <span class="remote">${remote_or_not()}</span>
            </div>
            <a href="${the_job.url}" target="_blank" class="btn text-decoration-none px-4">Apply Now</a>
            <i class="fa-solid col fa-bookmark saved-ico saved"></i>
            <div class="back">
                <i class="fa-solid fa-arrow-left"></i>
            </div>
            `;

            job_details.innerHTML = the_job.description;

            job_details.prepend(job__details__header);
            // job_details  functions
            let saved_ico = document.querySelector(".saved-ico");
            let back_ico = document.querySelector(".back");

            back_ico.addEventListener("click", () => {
                main_content.style.display = "flex";
                job_details.style.display = 'none';
            });

            saved_ico.addEventListener("click", () => {
                let job_id = saved_ico.parentElement.parentElement.getAttribute("job-id");

                // active class
                saved_ico.classList.toggle("saved");
                // add or remove from saved
                if(!saved_ico.classList.contains("saved")) {
                    my_jobs_id.delete(job_id);
                    localStorage.setItem("saved-jobs-id", JSON.stringify([...my_jobs_id]));
                } else{
                    my_jobs_id.add(job_id);
                    localStorage.setItem("saved-jobs-id", JSON.stringify([...my_jobs_id]));
                }
            });



            
        });
    });

});