import type { KnowledgeBase } from "@/lib/types";

const CHECKED = "2026-11-09";
const OFFICE_URL = "https://adzu.edu.ph/about-us/admissions-aid";
const PORTAL_URL = "https://admissions.host.adzu.edu.ph/";
const SCHOLARSHIP_URL = "https://adzu.edu.ph/scholarship-and-financial-grants";
const UNIVERSITY_SCHOLARSHIP_URL = "https://adzu.edu.ph/university-scholarships";
const FORM_URL =
  "https://adzu.edu.ph/wp-content/uploads/2024/03/AdZU-Scholarship-Application-Form.pdf";
const FACEBOOK_BLUE_EAGLE =
  "https://www.facebook.com/ateneodezamboangauniversity/posts/ateneo-de-zamboanga-university-blue-eagle-scholars-for-sy-2026-2027-the-results-/1359158736245325";
const FACEBOOK_CET =
  "https://www.facebook.com/ateneodezamboangauniversity/posts/bybs-take-the-adzu-cet-on-november-14-2026-and-discover-sedyour-future-in-teachi/1547074120787118/";
const FACEBOOK_SCHOLARSHIP =
  "https://www.facebook.com/ateneodezamboangauniversity/posts/scholarship-application-is-now-open-until-april-17-2026what-if-one-opportunity-c/1366714528823079";
const FINANCE_URL = "https://adzu.edu.ph/about-us/finance-office/";
const GCASH_URL = "https://adzu.edu.ph/adzu-is-now-on-gcash/";

export const SEED_KB: KnowledgeBase = {
  version: 1,
  updatedAt: "2026-11-09T00:00:00.000Z",
  documents: [
    {
      id: "admissions-how-to-apply-cet",
      title: "How to apply for the AdZU College Entrance Test (CET)",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The College Admissions & Aid Office lists three steps for the AdZU College Entrance Test:

1. Go to the online application portal at https://admissions.host.adzu.edu.ph/ and fill out the online application form.
2. Screenshot the code shown at the end of the online application page.
3. Visit the AdZU College Admissions and Aid Office at least two (2) days before your examination date to get your test permit, then pay the entrance exam fee at the Finance Office.

The office's October 2026 CET announcement says to secure the test permit at least two days before the exam. For the November 14, 2026 CET, that means by November 12, 2026.

Bring these when you visit the Admissions & Aid Office:
- A screenshot of the code from the online application.
- One (1) piece 2x2 picture of the applicant.
- The entrance exam fee. The Admissions & Aid page lists PHP 300.00, while the office's October 2026 CET announcement says PHP 350.00. Confirm the current amount with the office before paying.

The office is on the Ground Floor, Bellarmine–Campion Building, Salvador Campus, AdZU, La Purisima Street, Zamboanga City. For questions, call 9910871 local 2211 or 2212, or text +639277705888 / +639082613133. Email: admissions@adzu.edu.ph.`,
    },
    {
      id: "admissions-enrollment-requirements",
      title: "Enrollment requirements for new students and transferees",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `Requirements for enrollment as a new student:
1. Original Report Card (Form 138).
2. Original Certificate of Good Moral Character.
3. Birth Certificate (photocopy).
4. College Entrance Test Result (RTCU).

Requirements for transferees:
1. Original Transfer Credential (Honorable Dismissal).
2. Original Certificate of Good Moral Character.
3. Original copy of Transcript of Records (TOR).
4. Photocopy of Birth Certificate.
5. College Entrance Test Result (RTCU).

The College Admissions & Aid Office facilitates enrollment of new students, first-year students, and transfer students. Bring originals and photocopies as requested, and confirm the current checklist with the office before your enrollment date.`,
    },
    {
      id: "admissions-cet-schedule",
      title: "CET schedules and testing centers",
      category: "admissions",
      sourceUrl: FACEBOOK_CET,
      sourceType: "official-facebook",
      addedAt: CHECKED,
      text: `The College Admissions & Aid Office announces College Entrance Test schedules. The office administers the CET in Zamboanga City and in provincial testing centers.

An October 24, 2026 announcement from the official Ateneo de Zamboanga University Facebook page listed the AdZU CET for School Year 2027–2028 on November 14, 2026 at the Salvador Campus, with online application through https://admissions.host.adzu.edu.ph/.

CET dates, testing centers, and application deadlines can change. Always confirm the latest schedule with the College Admissions & Aid Office or the online application portal before paying or traveling. If you miss a scheduled date, ask the office about the next available CET.`,
    },
    {
      id: "admissions-test-permit",
      title: "Test permit, exam fee, and what to bring",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `After completing the online CET application, screenshot the code shown at the end of the form. Bring that screenshot, one 2x2 picture, and the entrance exam fee to the College Admissions & Aid Office.

Secure your test permit at least two (2) days before the examination date. For the November 14, 2026 CET, that means by November 12, 2026. The office issues the test permit. The entrance exam fee is paid at the Finance Office.

Fee note: the Admissions & Aid page lists PHP 300.00, but the office's October 2026 CET announcement says PHP 350.00. Confirm the current fee with the office before paying.

If you are applying from outside Zamboanga City, ask the office about provincial testing centers and whether the same permit process applies to your chosen site.`,
    },
    {
      id: "admissions-programs",
      title: "Colleges and schools at AdZU",
      category: "admissions",
      sourceUrl: "https://adzu.edu.ph/academics/",
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `Ateneo de Zamboanga University's higher education units include:

- School of Management and Accountancy (SMA)
- School of Liberal Arts (SLA)
- College of Science, Information Technology and Engineering (CSITE)
- School of Education (SEd)
- College of Nursing (CON)

Professional schools include the Graduate School, the Rosendo U. Castillo Jr. College of Law, and the School of Medicine.

Program offerings, curricula, and board-exam preparation can change. Check the specific school or college page, or ask the Admissions & Aid Office which program fits your background.`,
    },
    {
      id: "admissions-contact",
      title: "Contact and location of the College Admissions & Aid Office",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `College Admissions & Aid Office
Ground Floor, Bellarmine–Campion Building
Salvador Campus, Ateneo de Zamboanga University
La Purisima Street, Zamboanga City

Phone: 9910871 local 2211 or 2212
Mobile: +639277705888 or +639082613133
Email: admissions@adzu.edu.ph
Scholarship submissions: admissionsandaid@adzu.edu.ph

The office processes CET applications and results, enrollment of new and transfer students, academic program shifting, scholarship applications, and scholar performance evaluation.`,
    },
    {
      id: "general-staff-directory",
      title: "College Admissions & Aid Office staff directory",
      category: "general",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The official AdZU College Admissions & Aid Office page lists these people:

- Jennifer G. Reyes — Director. Students and families often call her Ma'am Jen.
- Crizel P. Cardenas — Staff; scholarship and ASAA work. Often called Ma'am Cris.
- Rose Jasmine Lumigis — Staff; scholarship and financial-aid work. Often called Ma'am Rose.
- Sherry Gloria A. Lim — Staff; Admissions, and the CET Test Coordinator. Often called Ma'am Sherry.
- Marilou Pong — Staff; Admissions and enrollment. Often called Ma'am Marilou.

The same office handles CET applications and results, freshman and transferee enrollment, academic program shifting, scholarship applications, and scholar performance evaluation.

Office: Ground Floor, Bellarmine–Campion Building, Salvador Campus, La Purisima Street, Zamboanga City. Phone: 9910871 local 2211 or 2212. Mobile: +639277705888 or +639082613133. Email: admissions@adzu.edu.ph. Scholarship papers: admissionsandaid@adzu.edu.ph.

Names, roles, and assignments can change. Confirm with the office before quoting a specific person for a decision.`,
    },
    {
      id: "admissions-shifting",
      title: "Shifting to another academic program",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The College Admissions & Aid Office says it facilitates academic program shifting. If you are already enrolled and want to move to another program, ask the office for the current shifting form, the deadline for your batch, and whether your credits can be credited.

Requirements and deadlines can depend on the program you are leaving and the program you want to enter. Confirm with the Admissions & Aid Office and your current school/college before withdrawing from subjects.`,
    },
    {
      id: "admissions-provincial",
      title: "Applicants from outside Zamboanga City",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The Admissions & Aid Office administers the College Entrance Test in Zamboanga City and in provincial testing centers. If you are applying from another city or province, contact the office before making travel plans so you can be assigned to the nearest available testing center.

The online application is at https://admissions.host.adzu.edu.ph/. The office can confirm whether your testing center requires a different permit process, and what documents you should bring.`,
    },
    {
      id: "admissions-professional-schools",
      title: "Graduate School, Law, and Medicine admissions are separate",
      category: "admissions",
      sourceUrl: "https://adzu.edu.ph/admission-requirements-for-som",
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `College admissions through the College Admissions & Aid Office cover undergraduate programs. The Graduate School, the Rosendo U. Castillo Jr. College of Law, and the School of Medicine have their own admission requirements and processes.

For graduate programs, check the Graduate School admission requirements page. For the School of Medicine, the official requirements page lists a completed four-year baccalaureate degree, NMAT report (at least 40%), transcript of records, weighted percentage average (GPA/GWA), certificate of graduation, certificate of good moral character, PSA birth certificate, and 2x2 photos. Applicants submit three sets of documents, take an entrance examination, and sit for an interview. For Law, check the College of Law's current requirements and entrance-test rules.

Always confirm with the specific professional school before submitting documents.`,
    },
    {
      id: "admissions-faqs",
      title: "Quick admissions answers",
      category: "admissions",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `Can I apply online? Yes. Start at https://admissions.host.adzu.edu.ph/, then follow the instructions for the test permit and fee.

How much is the entrance exam fee? The Admissions & Aid page lists PHP 300.00, but the office's October 2026 announcement says PHP 350.00. Confirm the current amount before paying.

When do I get the test permit? At least two (2) days before the examination date. For the November 14, 2026 CET, that means by November 12, 2026.

What do I bring to the office? The screenshot of your application code, one 2x2 picture, and the current entrance exam fee.

What are the freshman enrollment requirements? Form 138, Certificate of Good Moral Character, photocopy of birth certificate, and College Entrance Test Result (RTCU).

What are the transferee requirements? Honorable Dismissal/Transfer Credential, Certificate of Good Moral Character, original TOR, photocopy of birth certificate, and CET result (RTCU).

Where is the office? Ground Floor, Bellarmine–Campion Building, Salvador Campus, La Purisima Street, Zamboanga City.

The assistant cannot approve applications, reserve slots, or change deadlines. Submitting requirements does not guarantee admission or a slot. For decisions about your case, contact the Admissions & Aid Office directly.`,
    },
    {
      id: "scholarships-how-to-apply",
      title: "How to apply for an AdZU scholarship or financial grant",
      category: "scholarships",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The College Admissions & Aid Office lists these steps for a scholarship application:

1. Fill up the scholarship application form and attach the required documents. The form is available at the College Admissions & Aid Office or downloadable from the office's page.
2. Submit the completed application to the College Admissions & Aid Office, or email it to admissionsandaid@adzu.edu.ph.

Required documents:
- Scholarship application form.
- Detailed personal statement about the need for a scholarship grant or financial aid.
- Clear copy of the most recent Income Tax Return (ITR) of the applicant's parents or guardians.
- Copy of the applicant's Senior High School card.
- Letter of recommendation from an Imam (for Muslim applicants), a Pastor (for non-Catholic applicants), or the Parish Priest (for Catholic applicants).
- Detailed sketch of your residence, including house number, street, and landmarks.
- Copy of the applicant's latest electric bills or receipts for the past three months.

The downloadable application form adds two requirements that are not listed on the web page: a recent 1x1 photo and a clear copy of the applicant's Entrance Test Result. The form is accomplished by the applicant's parent or legal guardian.

The form also states that applying for a scholarship grant does not, in any way, influence admission into the university. Applicants may be interviewed and may be subject to a house visit.

The official application form is available at ${FORM_URL}.`,
    },
    {
      id: "scholarships-types",
      title: "University scholarship grants listed by AdZU",
      category: "scholarships",
      sourceUrl: UNIVERSITY_SCHOLARSHIP_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `AdZU's University Scholarships page is dated 2009; treat the amounts and rules below as historical until the Admissions & Aid Office confirms the current offer. It lists these university-funded grants:

- ADZU Centennial Scholarship: awarded annually to topnotchers of the university's entrance examination; covers full tuition and fees/matriculation for any degree program of the awardee's choice.
- ADZU BSE Millennium Scholarship: for academically exceptional students taking Bachelor of Elementary Education or Bachelor of Secondary Education. The 2009 page said it would be replaced the following school year by the Ateneo BSE Centennial Scholarship, so confirm whether it is still offered.
- St. Ignatius of Loyola Merit Scholarship: for high school valedictorians who enroll at AdZU; 100% discount on tuition, excluding miscellaneous and other fees.
- St. Francis Xavier Merit Scholarship: for high school salutatorians who enroll at AdZU; 50% discount on tuition, excluding miscellaneous and other fees.
- Student Assistantship: a service scholarship for students in dire financial need; covers 100% tuition discount plus book rentals in the first year of service, and additional 100% miscellaneous coverage (excluding other fees) in the second and subsequent years.

The page also mentions discounts for band members, brothers/sisters in AdZU, children of faculty and employees, children of retirees, faculty/employees, and seminarians. Scholarship rules and amounts can change; confirm the current offer with the Admissions & Aid Office.`,
    },
    {
      id: "scholarships-financial-grants",
      title: "Scholarship and financial grant categories",
      category: "scholarships",
      sourceUrl: SCHOLARSHIP_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `AdZU's scholarship and financial grants page is dated 2009; the categories are useful, but current amounts and rules should be confirmed with the office. It groups assistance into:

Ateneo scholarships funded by the university, including the Blue Eagle Academic Scholarship, ADZU-BSE Millennium Scholarship, academic scholarships for high school valedictorians and salutatorians, the Ateneo Band Scholarship, special scholarships for academically outstanding students with financial need, the President's Scholarship for students with a high school general average of at least 87%, and Student Assistantship/Financial Grant for students with great financial need who can render service.

Government scholarships funded by agencies such as CHED, DOST, and others. The page lists examples including CHED scholarships, DOST, AFP and PVAO education benefits, GSIS, NAPOLCOM, and PESFA. The page says that, with the exception of PESFA, these are processed and awarded by CHED and the respective agencies.

Private scholarships from individuals, foundations, and companies. The page lists examples such as the Metrobank Foundation, Alfonso Yuchengco Foundation, Tanging Yaman Foundation, and many named donor funds.

The assistant can explain the categories and the application requirements, but cannot confirm your eligibility or award amount. Ask the Admissions & Aid Office for the current list and deadlines.`,
    },
    {
      id: "scholarships-blue-eagle",
      title: "Blue Eagle Academic Scholarship",
      category: "scholarships",
      sourceUrl: FACEBOOK_BLUE_EAGLE,
      sourceType: "official-facebook",
      addedAt: CHECKED,
      text: `The Blue Eagle Academic Scholarship is awarded to topnotchers in the Ateneo's admission test for colleges and universities (ATCU).

A March 2026 announcement on the official Ateneo de Zamboanga University Facebook page about Blue Eagle Scholars for SY 2026–2027 says the awardees receive full tuition and fees for any college degree they choose. The exact number of slots and renewal rules are set for each school year, and results are posted on the AdZU website.

For the current Blue Eagle application process, requirements, and results, contact the Admissions & Aid Office at 0927 770 5888 or 0908 261 3133, or email admissionsandaid@adzu.edu.ph.`,
    },
    {
      id: "scholarships-student-assistantship",
      title: "Student Assistantship and service grants",
      category: "scholarships",
      sourceUrl: UNIVERSITY_SCHOLARSHIP_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `Student Assistantship is described by AdZU as primarily a service scholarship for students in dire financial need. It covers a 100% tuition discount plus book rentals in the first year of service, and an additional 100% miscellaneous coverage (excluding other fees) in the second and subsequent years.

Because it involves service to the university, ask the Admissions & Aid Office about the work assignment, schedule, performance expectations, and renewal conditions before accepting the grant.`,
    },
    {
      id: "scholarships-summer",
      title: "Do scholarships cover summer classes?",
      category: "scholarships",
      sourceUrl: SCHOLARSHIP_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `According to AdZU's scholarship and financial grants page, all scholarships and grants do not cover summer enrollment.

Scholars who want summer coverage must make a written request addressed to their respective benefactors and submit it to the Office of Scholarships for processing on or before the midterm examinations week of the second semester of the current school year. The page says no requests for summer coverage will be entertained beyond that time.

Confirm the current rule and deadline with the Admissions & Aid Office, because the page may not reflect the latest memo.`,
    },
    {
      id: "scholarships-deadlines",
      title: "Scholarship deadlines and application period",
      category: "scholarships",
      sourceUrl: FACEBOOK_SCHOLARSHIP,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The official Admissions & Aid page does not publish one fixed scholarship deadline for all applicants. The office announces the application period, requirements, and deadlines for each school year.

The most recent announced window that appears on the official AdZU Facebook page was open until April 17, 2026. That window has closed; the next cycle's dates are announced by the office.

Do not rely on an old deadline from a social-media post. Contact the College Admissions & Aid Office for the current schedule:
- Phone: 9910871 local 2211 or 2212
- Mobile: +639277705888 or +639082613133
- Email: admissionsandaid@adzu.edu.ph

Submit early enough to complete missing documents, especially the ITR, recommendation letter, and electric bills.`,
    },
    {
      id: "scholarships-eligibility",
      title: "Who can apply for financial aid?",
      category: "scholarships",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `The scholarship application requirements ask for a detailed personal statement about the need for a scholarship grant or financial aid, the parents' or guardians' most recent ITR, the applicant's Senior High School card, a recommendation letter, a sketch of the residence, and recent electric bills. The downloadable form also asks for a recent 1x1 photo and a copy of the Entrance Test Result.

Applying for a scholarship does not influence admission to the university, according to the official application form.

These documents suggest that both financial need and academic records are considered. The official page does not publish a single income cutoff or a guaranteed minimum grade for every grant. Eligibility varies by scholarship, and some grants are merit-based (for example, valedictorian and salutatorian scholarships) while others are need-based or service-based.

The assistant cannot pre-screen or guarantee eligibility. Ask the Admissions & Aid Office to evaluate your specific situation.`,
    },
    {
      id: "scholarships-contact",
      title: "Where to submit scholarship documents",
      category: "scholarships",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `Submit scholarship applications to the College Admissions & Aid Office, Ground Floor, Bellarmine–Campion Building, Salvador Campus, La Purisima Street, Zamboanga City.

You may also email the application to admissionsandaid@adzu.edu.ph. For questions, call 9910871 local 2211 or 2212, or text +639277705888 / +639082613133.

Keep a copy of everything you submit. If you email documents, use clear file names and follow up with the office to confirm receipt.`,
    },
    {
      id: "admissions-shs",
      title: "Senior High School and basic education admissions are separate",
      category: "admissions",
      sourceUrl: "https://adzu.edu.ph/academics/senior-high-school/",
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `This desk focuses on college admissions through the College Admissions & Aid Office. Senior High School (Grade 11) and basic education have separate admission processes, requirements, and channels.

If you are applying to Senior High School, contact the Senior High School office or check the SHS admissions page. The college CET, college test permit, and college enrollment requirements described here do not automatically apply to SHS applicants.

If you are unsure which office handles your level, ask the Admissions & Aid Office and they will point you to the right unit.`,
    },
    {
      id: "general-about",
      title: "About Ateneo de Zamboanga University",
      category: "general",
      sourceUrl: "https://adzu.edu.ph/about-us/history/",
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `Ateneo de Zamboanga University (AdZU) is a private, Catholic, co-educational university in Zamboanga City, Philippines. It was founded in 1912 by Spanish Jesuits and is one of the oldest Jesuit schools in the country. It offers basic education, undergraduate programs, and professional studies through its schools and colleges.

The university's motto is "Pro Deo et Patria" (For God and Country). Its higher education units include the School of Management and Accountancy, School of Liberal Arts, College of Science, Information Technology and Engineering, School of Education, and College of Nursing, with professional schools for graduate studies, law, and medicine.`,
    },
    {
      id: "general-fees",
      title: "Tuition, fees, and paying through GCash",
      category: "general",
      sourceUrl: GCASH_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `This assistant does not have a tuition or fee schedule. Tuition and fees vary by program, load, and school year, so ask the Finance Office for the official assessment for your case.

Finance Office contact:
- Direct line/fax: (062) 993-2860
- Trunkline: (062) 991-0871, local 1010 (Treasurer), 1012 (Cashier), 1014 (Student Account Section), 1011 (Office Staff)
- Mobile: +63 966 342 8252
- Email: finance@adzu.edu.ph

GCash payment: AdZU announced in March 2026 that students can pay through GCash by opening the GCash app, tapping Bills, selecting Schools, searching for “Ateneo de Zamboanga,” filling in the required information, and completing the payment. For payment questions, contact the Finance Office.`,
    },
    {
      id: "general-contact",
      title: "Key contact details",
      category: "general",
      sourceUrl: OFFICE_URL,
      sourceType: "official-web",
      addedAt: CHECKED,
      text: `College Admissions & Aid Office
Ground Floor, Bellarmine–Campion Building, Salvador Campus
Ateneo de Zamboanga University, La Purisima Street, Zamboanga City
Phone: 9910871 local 2211 or 2212
Mobile: +639277705888 or +639082613133
Email: admissions@adzu.edu.ph
Scholarship email: admissionsandaid@adzu.edu.ph
Online application: https://admissions.host.adzu.edu.ph/

University Communications Office: communications@adzu.edu.ph, (062) 991-0871 local 2025/2026.

For questions about tuition and fees, contact the Finance Office: finance@adzu.edu.ph, (062) 991-0871 local 1011, or (062) 993-2860. For program-specific questions, contact the relevant school or college.`,
    },
    {
      id: "general-disclaimer",
      title: "What this assistant can and cannot do",
      category: "general",
      sourceUrl: OFFICE_URL,
      sourceType: "note",
      addedAt: CHECKED,
      text: `This is an unofficial, student-built assistant for Ateneo de Zamboanga University admissions and scholarship questions. It answers only from the documents in its knowledge base, which may include official AdZU pages, forms, announcements, and files uploaded by authorized staff.

It cannot approve an application, reserve a slot, assess your eligibility, change a deadline, or speak officially for the university. Answers may be incomplete or outdated. For decisions about your application, scholarship, requirements, or fees, contact the College Admissions & Aid Office directly.

The assistant will say when it does not have an answer in its notes rather than invent one.`,
    },
  ],
};
