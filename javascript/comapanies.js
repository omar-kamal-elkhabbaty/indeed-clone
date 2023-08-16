const companies_cont = document.querySelector(".companies_cont");
const req = fetch('https://www.arbeitnow.com/api/job-board-api').then(res => res.json());

req.then((res) => {
    const data_obj = res.data;
    const companies = new Set(data_obj.map(ele => {return ele.company_name}));

    // render data
    companies.forEach((company) => {

        const company_jobs = [];

        data_obj.forEach((ele) => {
            if(ele.company_name === company) {
                company_jobs.push(ele.company_name);
            }
        });

        function jobs_num() {
            if(company_jobs.length > 1) {
                return `${company_jobs.length} jobs`
            } else{
                return `${company_jobs.length} job`;
            }
        }

        let company_div = document.createElement("div");
        company_div.classList.add("company", "p-3");

        company_div.innerHTML = `
        <img src="../images/company.svg" alt="company-logo">
        <div class="company_info">
            <div>
            <h2>${company}</h2>
            <div class="jobs_num">${jobs_num()}</div>
            </div>

            <div class="rates">
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            <i class="fa-solid fa-star"></i>
            </div>
        </div>
        `;

        companies_cont.append(company_div);
    });

});

req.catch((err) => {
    document.body.classList.add("load-body");
});
