document.addEventListener("DOMContentLoaded", function () {

    const employees = ONBOARDING_DATA.employees;


    /* -----------------------------
       HELPER FUNCTIONS
    ----------------------------- */

    function getEmployeeProgress(employee) {

        const fields = [
            employee.laptop,
            employee.okta,
            employee.emailSetup,
            employee.quest1,
            employee.quest2,
            employee.quest3,
            employee.quest4,
            employee.quest5
        ];

        let completed = 0;

        fields.forEach(function (value) {

            if (
                value === "Complete" ||
                value === "Shipped"
            ) {
                completed++;
            }

        });

        return Math.round(
            (completed / fields.length) * 100
        );
    }


    function getStatus(employee) {

        const progress = getEmployeeProgress(employee);

        if (progress >= 90) {
            return "Ready";
        }

        if (progress >= 60) {
            return "In Progress";
        }

        return "Needs Attention";
    }


    function statusClass(status) {

        if (status === "Ready") {
            return "status-success";
        }

        if (status === "Needs Attention") {
            return "status-danger";
        }

        return "status-warning";
    }


    /* -----------------------------
       KPI CALCULATIONS
    ----------------------------- */

    const totalHires = employees.length;

    const monthlyHires = employees.filter(function (employee) {

        return employee.hireDate.startsWith("2026-10");

    }).length;


    const activeCohortEmployees = employees.filter(function (employee) {

        return employee.cohort === "October 14, 2026";

    }).length;


    const totalProgress = employees.reduce(function (sum, employee) {

        return sum + getEmployeeProgress(employee);

    }, 0);


    const completionRate = Math.round(
        totalProgress / employees.length
    );


    const attentionEmployees = employees.filter(function (employee) {

        return (
            getStatus(employee) === "Needs Attention" ||
            employee.laptop === "Pending"
        );

    });


    document.getElementById("totalHires").textContent =
        totalHires;

    document.getElementById("monthlyHires").textContent =
        monthlyHires;

    document.getElementById("activeCohort").textContent =
        activeCohortEmployees;

    document.getElementById("completionRate").textContent =
        completionRate + "%";

    document.getElementById("attentionCount").textContent =
        attentionEmployees.length;



    /* -----------------------------
       COHORTS
    ----------------------------- */

    const cohortMap = {};

    employees.forEach(function (employee) {

        if (!cohortMap[employee.cohort]) {

            cohortMap[employee.cohort] = [];

        }

        cohortMap[employee.cohort].push(employee);

    });


    const cohortList =
        document.getElementById("cohortList");


    Object.keys(cohortMap)
        .sort()
        .reverse()
        .forEach(function (cohortName) {

            const cohortEmployees =
                cohortMap[cohortName];


            const cohortProgress =
                Math.round(
                    cohortEmployees.reduce(
                        function (sum, employee) {

                            return sum +
                                getEmployeeProgress(employee);

                        },
                        0
                    ) / cohortEmployees.length
                );


            const cohortHTML = `

                <div class="cohort">

                    <div class="cohort-top">

                        <div>

                            <div class="cohort-name">
                                ${cohortName}
                            </div>

                            <div class="cohort-meta">
                                ${cohortEmployees.length}
                                employees
                            </div>

                        </div>

                        <strong>
                            ${cohortProgress}%
                        </strong>

                    </div>

                    <div class="progress">

                        <div
                            class="progress-bar"
                            style="width:${cohortProgress}%"
                        ></div>

                    </div>

                </div>

            `;


            cohortList.innerHTML += cohortHTML;

        });



    /* -----------------------------
       NEEDS ATTENTION
    ----------------------------- */

    const attentionList =
        document.getElementById("attentionList");


    attentionEmployees
        .slice(0, 6)
        .forEach(function (employee) {

            let issue = "Onboarding incomplete";

            let issueClass = "status-warning";


            if (employee.laptop === "Pending") {

                issue = "Laptop pending";
                issueClass = "status-danger";

            }


            const html = `

                <div class="attention-item">

                    <div>

                        <div class="employee-name">
                            ${employee.name}
                        </div>

                        <div class="employee-role">
                            ${employee.role}
                        </div>

                    </div>

                    <div class="status ${issueClass}">
                        ${issue}
                    </div>

                </div>

            `;


            attentionList.innerHTML += html;

        });



    /* -----------------------------
       EMPLOYEE TABLE
    ----------------------------- */

    const employeeTable =
        document.getElementById("employeeTable");


    employees
        .filter(function (employee) {

            return (
                employee.hireDate ===
                ONBOARDING_DATA.referenceDate ||
                employee.hireDate === "2026-10-13"
            );

        })
        .forEach(function (employee) {

            const progress =
                getEmployeeProgress(employee);


            const status =
                getStatus(employee);


            const row = `

                <tr>

                    <td>

                        <div class="employee-cell">
                            ${employee.name}
                        </div>

                        <div class="employee-email">
                            ${employee.email}
                        </div>

                    </td>

                    <td>
                        ${employee.role}
                    </td>

                    <td>
                        ${employee.manager}
                    </td>

                    <td>
                        ${employee.recruiter}
                    </td>

                    <td>

                        <span class="status ${
                            employee.laptop === "Shipped"
                            ? "status-success"
                            : "status-danger"
                        }">

                            ${employee.laptop}

                        </span>

                    </td>

                    <td>

                        <div style="min-width:100px">

                            <div style="
                                font-size:11px;
                                margin-bottom:4px;
                            ">
                                ${progress}%
                            </div>

                            <div class="progress">

                                <div
                                    class="progress-bar"
                                    style="width:${progress}%"
                                ></div>

                            </div>

                        </div>

                    </td>

                    <td>

                        <span class="status ${
                            statusClass(status)
                        }">

                            ${status}

                        </span>

                    </td>

                </tr>

            `;


            employeeTable.innerHTML += row;

        });



    /* -----------------------------
       COMPLETION CHART
    ----------------------------- */

    const chart =
        document.getElementById("completionChart");


    const stages = [

        {
            name: "Laptop",
            value:
                employees.filter(
                    e => e.laptop === "Shipped"
                ).length
        },

        {
            name: "Okta",
            value:
                employees.filter(
                    e => e.okta === "Complete"
                ).length
        },

        {
            name: "Email",
            value:
                employees.filter(
                    e => e.emailSetup === "Complete"
                ).length
        },

        {
            name: "Quest 1",
            value:
                employees.filter(
                    e => e.quest1 === "Complete"
                ).length
        },

        {
            name: "Quest 2",
            value:
                employees.filter(
                    e => e.quest2 === "Complete"
                ).length
        },

        {
            name: "Quest 3",
            value:
                employees.filter(
                    e => e.quest3 === "Complete"
                ).length
        },

        {
            name: "Quest 4",
            value:
                employees.filter(
                    e => e.quest4 === "Complete"
                ).length
        },

        {
            name: "Quest 5",
            value:
                employees.filter(
                    e => e.quest5 === "Complete"
                ).length
        }

    ];


    stages.forEach(function (stage) {

        const percentage =
            Math.round(
                (stage.value / employees.length) * 100
            );


        chart.innerHTML += `

            <div class="bar-wrapper">

                <div class="bar-value">
                    ${percentage}%
                </div>

                <div
                    class="bar"
                    style="height:${Math.max(
                        percentage,
                        5
                    )}%"
                ></div>

                <div class="bar-label">
                    ${stage.name}
                </div>

            </div>

        `;

    });



    /* -----------------------------
       MANAGER READINESS
    ----------------------------- */

    const managerMap = {};


    employees.forEach(function (employee) {

        if (!managerMap[employee.manager]) {

            managerMap[employee.manager] = [];

        }

        managerMap[employee.manager].push(employee);

    });


    const managerList =
        document.getElementById("managerList");


    Object.keys(managerMap)
        .forEach(function (manager) {

            const managerEmployees =
                managerMap[manager];


            const managerProgress =
                Math.round(
                    managerEmployees.reduce(
                        function (sum, employee) {

                            return sum +
                                getEmployeeProgress(employee);

                        },
                        0
                    ) / managerEmployees.length
                );


            let managerStatus =
                "Good";


            let managerClass =
                "status-success";


            if (managerProgress < 70) {

                managerStatus =
                    "Follow-up";

                managerClass =
                    "status-warning";

            }


            managerList.innerHTML += `

                <div class="attention-item">

                    <div>

                        <div class="employee-name">
                            ${manager}
                        </div>

                        <div class="employee-role">
                            ${managerEmployees.length}
                            direct onboarding employees
                        </div>

                    </div>

                    <div>

                        <strong>
                            ${managerProgress}%
                        </strong>

                        <span class="status ${managerClass}">
                            ${managerStatus}
                        </span>

                    </div>

                </div>

            `;

        });

});
