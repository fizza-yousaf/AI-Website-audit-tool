const urlInput = document.querySelector("#website-url");
const analyzeBtn = document.querySelector("#analyze-btn");

const performanceResult = document.querySelector("#performance");
const seoResult = document.querySelector("#seo");
const accessibilityResult = document.querySelector("#accessibility");
const aiResult = document.querySelector("#ai-result");


// API KEYS

const PAGESPEED_KEY = "YOUR_OLD_KEY";
const GEMINI_KEY = "YOUR_OLD_KEY";





// Gemini AI Function

async function getAIRecommendations(issues){


    const response = await fetch(

        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_KEY}`,

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },


            body:JSON.stringify({

                contents:[

                    {

                        parts:[

                            {

                                text:`

You are an expert SEO and website performance auditor.

Analyze these Lighthouse issues:

${issues.join("\n")}


Create a professional but simple website audit report.

Use this exact structure:


🚀 AI Website Audit


Performance Issues


🔴 Issue Name

Problem:
Explain the issue in simple words.

Fix:
Give practical solution.



SEO Status


✅ Meta description
✅ Mobile friendly
✅ Search visibility



Recommendations


Priority 1:
Most important improvement


Priority 2:
Second important improvement


Keep the report short and easy for clients to understand.

`

                            }

                        ]

                    }

                ]

            })

        }

    );



    const data = await response.json();



    console.log(
        "Gemini Response:",
        data
    );



    if(!response.ok){

        throw new Error(
            data.error.message || "Gemini API Error"
        );

    }



    return data
    .candidates[0]
    .content
    .parts[0]
    .text;


}








// Analyze Website


analyzeBtn.addEventListener(
"click",
async function(){



    const websiteURL =
    urlInput.value.trim();




    if(websiteURL === ""){

        alert(
            "Please enter website URL"
        );

        return;

    }





    performanceResult.textContent =
    "Analyzing performance...";


    seoResult.textContent =
    "Checking SEO...";


    accessibilityResult.textContent =
    "Checking accessibility...";


    aiResult.textContent =
    "Generating AI audit...";






    let issues = [];






    // -------------------------
    // PageSpeed API
    // -------------------------


    try{


        const response = await fetch(

        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(websiteURL)}&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&key=${PAGESPEED_KEY}`

        );




        const data =
        await response.json();




        console.log(
            "PageSpeed Response:",
            data
        );




        if(!response.ok){

            throw new Error(
                data.error.message
            );

        }





        const lighthouse =
        data.lighthouseResult;




        const categories =
        lighthouse.categories;




        const audits =
        lighthouse.audits;





        // Scores


        const performanceScore =
        categories.performance
        ?
        Math.round(
            categories.performance.score * 100
        )
        :
        "N/A";



        const seoScore =
        categories.seo
        ?
        Math.round(
            categories.seo.score * 100
        )
        :
        "N/A";



        const accessibilityScore =
        categories.accessibility
        ?
        Math.round(
            categories.accessibility.score * 100
        )
        :
        "N/A";






        performanceResult.textContent =
        `Performance Score: ${performanceScore}%`;



        seoResult.textContent =
        `SEO Score: ${seoScore}%`;



        accessibilityResult.textContent =
        `Accessibility Score: ${accessibilityScore}%`;







        // Extract Problems


        Object.values(audits)
        .forEach(audit=>{


            if(

                audit.score !== null &&
                audit.score < 1 &&
                audit.title

            ){

                issues.push(
                    audit.title
                );

            }


        });





        console.log(
            "Issues Found:",
            issues
        );





    }


    catch(error){


        console.error(
            "PageSpeed Error:",
            error
        );


        performanceResult.textContent =
        "Analysis failed";


        seoResult.textContent =
        "Unable to check SEO";


        accessibilityResult.textContent =
        "Unable to check accessibility";


    }








    // -------------------------
    // Gemini AI
    // -------------------------


    try{


        if(issues.length > 0){



            const aiReport =
            await getAIRecommendations(
                issues.slice(0,10)
            );




           aiResult.innerHTML = aiReport

// Remove markdown symbols
.replace(/#{1,6}\s?/g, "")
.replace(/---/g, "")

// Convert bold text
.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

// Convert headings
.replace(
"🚀 AI Website Audit",
"<h2>🚀 AI Website Audit</h2>"
)

.replace(
"Performance Issues",
"<h3>🔧 Performance Issues</h3>"
)

.replace(
"SEO Status",
"<h3>🔍 SEO Status</h3>"
)

.replace(
"Recommendations",
"<h3>📌 Recommendations</h3>"
)

// Line breaks
.replace(/\n/g,"<br>");



        }


        else{


            aiResult.innerHTML =

            `
            <h2>🚀 AI Website Audit</h2>
            <p>
            ✅ Excellent website.
            No major Lighthouse issues detected.
            </p>
            `;


        }


    }



    catch(error){


        console.error(
            "Gemini Error:",
            error
        );


        aiResult.textContent =
        error.message;


    }



});