# Asclepius medical demo catalog

100 original, prepared educational replies. These are conservative general overviews and prompts for appropriate professional assessment. They are not personalized treatment, clinical triage, a diagnostic engine, or clinically validated patient-care content. No drug doses are supplied. A qualified clinician should review the complete catalog before any patient-care deployment.

Reference material was consulted on 14 October 2026, with particular attention to urgent chest symptoms, stroke, breathing difficulty, anaphylaxis, back-pain red flags, seizures, and medical test interpretation. The references support background information and selected safety wording; their inclusion is not a claim that every reply has received a clinical review.

Keyword matching chooses a topic, with topics 3 to 7 taking priority and skipping the normal demonstration delay. It cannot infer symptom severity, reliably understand negation, or detect every emergency. Unmatched questions receive the symptom-description prompt. Each response can be viewed with `/demo answer N`, where N is 1 to 100.

Edit `dev/medicalAnswers.ts` and run `node scripts/generateMedicalCatalog.mjs` to refresh this document.

## Reference material

- [Medical topics directory](https://medlineplus.gov/all_healthtopics.html)
- [Symptoms](https://medlineplus.gov/symptoms.html)
- [Chest pain](https://www.nhs.uk/symptoms/chest-pain/)
- [Stroke symptoms](https://www.nhs.uk/conditions/stroke/symptoms/)
- [Anaphylaxis](https://www.nhs.uk/conditions/anaphylaxis/)
- [Shortness of breath](https://www.nhs.uk/symptoms/shortness-of-breath/)
- [Back pain](https://www.nhs.uk/conditions/back-pain/)
- [Seizures](https://medlineplus.gov/seizures.html)
- [Diabetes](https://medlineplus.gov/diabetes.html)
- [HbA1c](https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/)
- [Celiac disease](https://medlineplus.gov/celiacdisease.html)
- [Mental health](https://medlineplus.gov/mentalhealth.html)
- [Medicines](https://medlineplus.gov/medicines.html)
- [Medical tests](https://medlineplus.gov/lab-tests/)
- [Checkups](https://medlineplus.gov/healthcheckup.html)

## Replies

### 1. Describing symptoms

Preview: `/demo answer 1`

Keywords: describe my symptoms, symptom diary, describe symptoms

Start with what you are feeling, where it happens, and when it began. Note whether it is constant or comes and goes.

A short symptom timeline can help a clinician. Please leave out your name and other identifying details.

### 2. Health questions

Preview: `/demo answer 2`

Keywords: health question, medical question

I can help explain general health terms and organize questions for a clinician. Tell me the topic you would like to understand.

These are prepared educational replies. They cannot diagnose a condition or replace a medical assessment.

### 3. Chest pain

Preview: `/demo answer 3`

Keywords: chest pain, chest pressure, chest tightness, heart attack

Sudden or persistent chest pain, especially with breathlessness, sweating, or pain spreading to the arm or jaw, needs emergency medical help. Call your local emergency number now if this describes you.

Even chest pain that comes and goes should be assessed by a clinician.

### 4. Stroke symptoms

Preview: `/demo answer 4`

Keywords: stroke, face drooping, slurred speech, one sided weakness

Sudden facial drooping, arm weakness, or speech difficulty can be signs of a stroke. Call your local emergency number immediately, even if the symptoms disappear.

Do not drive yourself. Tell the emergency team when the symptoms started.

### 5. Severe breathing difficulty

Preview: `/demo answer 5`

Keywords: cannot breathe, can t breathe, gasping, blue lips

Severe difficulty breathing, gasping, or blue or grey lips needs immediate emergency help. Call your local emergency number now.

Do not wait for a chat response to decide what to do. Follow the emergency dispatcher's instructions.

### 6. Severe allergic reaction

Preview: `/demo answer 6`

Keywords: anaphylaxis, throat swelling, tongue swelling, throat closing

Sudden tongue or throat swelling, difficulty breathing, or collapse can indicate a severe allergic reaction. Call your local emergency number immediately.

If you have a prescribed adrenaline auto-injector, use it according to its instructions. Emergency assessment is still needed.

### 7. Immediate mental health safety

Preview: `/demo answer 7`

Keywords: hurt myself, kill myself, suicidal, self harm

I am glad you told me. If you might act on thoughts of hurting yourself, contact emergency services now or go to the nearest emergency department.

Ask someone you trust to stay with you, and move away from anything you could use to harm yourself.

### 8. Headache

Preview: `/demo answer 8`

Keywords: headache, head pain

Headaches have many possible causes, so location, timing, and associated symptoms matter. A clinician can assess new or recurring headaches.

A sudden, extremely severe headache, or headache with weakness, confusion, fever and a stiff neck, needs urgent medical assessment.

### 9. Migraine

Preview: `/demo answer 9`

Keywords: migraine, visual aura

Migraine can involve headache, nausea, and sensitivity to light or sound. Some people also experience an aura.

Keep a record of episodes and discuss it with a clinician. New neurological symptoms should not automatically be assumed to be migraine.

### 10. Dizziness

Preview: `/demo answer 10`

Keywords: dizzy, dizziness, lightheaded

Dizziness can mean spinning, unsteadiness, or feeling faint. Describing which sensation you have helps a clinician assess it.

Sit somewhere safe if you feel unsteady. Sudden dizziness with speech problems, weakness, or severe chest symptoms needs emergency assessment.

### 11. Fainting

Preview: `/demo answer 11`

Keywords: fainting, passed out, blackout

Fainting is a brief loss of consciousness and deserves attention, especially if it is new or repeated. Note what happened before and after the episode.

If someone is unresponsive, or fainting occurs with chest pain or serious injury, call emergency services.

### 12. Fever

Preview: `/demo answer 12`

Keywords: fever, high temperature

A fever is a sign rather than a diagnosis. Its significance depends on age, other symptoms, and the person's medical history.

Seek prompt medical advice for a baby with a fever or anyone who is very unwell, confused, or struggling to breathe.

### 13. Fatigue

Preview: `/demo answer 13`

Keywords: fatigue, tired, exhaustion

Persistent fatigue can relate to sleep, stress, illness, medicines, or other factors. A clinician may ask about your routine and accompanying symptoms.

Record how long it has lasted and how it affects everyday activities. Unexplained or worsening fatigue deserves assessment.

### 14. Sleep difficulty

Preview: `/demo answer 14`

Keywords: insomnia, cannot sleep, can t sleep, sleep difficulty

Sleep difficulty can involve falling asleep, staying asleep, or waking too early. A sleep diary can show the pattern and daytime effects.

If it persists, discuss it with a clinician rather than starting or combining sleep medicines yourself.

### 15. Sleep apnea

Preview: `/demo answer 15`

Keywords: sleep apnea, sleep apnoea, snoring

Loud snoring with pauses in breathing or marked daytime sleepiness can warrant assessment for sleep apnea. Diagnosis usually involves a sleep study.

Tell a clinician what you or a sleeping partner have noticed. Do not drive if you are too sleepy to do so safely.

### 16. Stress

Preview: `/demo answer 16`

Keywords: stress, overwhelmed

Stress can affect sleep, concentration, mood, and physical comfort. Identifying what has changed can help you explain your concerns.

If stress is affecting daily life, a health professional can help you consider support. You do not need to manage it alone.

### 17. Anxiety

Preview: `/demo answer 17`

Keywords: anxiety, anxious

Anxiety can involve persistent worry and physical sensations such as a racing heart. A clinician can assess the symptoms and discuss support options.

New chest pain, fainting, or severe breathlessness should be assessed rather than assumed to be anxiety.

### 18. Panic attacks

Preview: `/demo answer 18`

Keywords: panic attack, panic attacks

A panic attack can feel sudden and frightening. Similar symptoms can also occur with physical illness, so new or unusual episodes deserve assessment.

A health professional can help you understand the pattern and discuss treatment options.

### 19. Low mood

Preview: `/demo answer 19`

Keywords: depression, low mood, depressed

Persistent low mood or loss of interest can affect sleep, appetite, and daily functioning. A clinician can help assess what is happening.

Support and treatment are available. If you feel unsafe or might hurt yourself, seek immediate help from emergency services or someone nearby.

### 20. Memory concerns

Preview: `/demo answer 20`

Keywords: memory loss, forgetful, memory problems

Memory concerns can have several explanations and do not by themselves establish a diagnosis. Give a clinician examples of changes and their effect on daily life.

Sudden confusion is different from gradual forgetfulness and needs urgent medical assessment.

### 21. Tingling and numbness

Preview: `/demo answer 21`

Keywords: tingling, numbness, pins and needles

Tingling or numbness can have different causes depending on its location and timing. Record whether it is persistent, spreading, or associated with weakness.

Sudden symptoms on one side of the body, especially with speech or face changes, require emergency help.

### 22. Seizures

Preview: `/demo answer 22`

Keywords: seizure, epilepsy, convulsion

Seizures need medical assessment, particularly a first episode. During a convulsion, keep the person safe from nearby hazards and do not put anything in their mouth.

Call emergency services for a first seizure, prolonged seizure, repeated seizures, injury, or breathing difficulty.

### 23. Back pain

Preview: `/demo answer 23`

Keywords: back pain, backache

Back pain has many causes, and assessment depends on its duration, location, and effect on movement. Tell a clinician about any injury or other symptoms.

Back pain with new bladder or bowel problems, numbness around the groin, or leg weakness needs urgent assessment.

### 24. Neck pain

Preview: `/demo answer 24`

Keywords: neck pain, neck stiffness

Neck pain may relate to muscles, joints, or other causes. A clinician can assess persistent pain or pain after an injury.

Neck stiffness with fever, a severe headache, or confusion requires urgent medical assessment.

### 25. Knee pain

Preview: `/demo answer 25`

Keywords: knee pain

Knee pain can involve injury, joint irritation, or other conditions. Note whether there is swelling, locking, or difficulty bearing weight.

A hot, very swollen joint, especially with fever, needs prompt medical assessment.

### 26. Joint pain

Preview: `/demo answer 26`

Keywords: joint pain, aching joints

Joint pain is a symptom rather than a specific diagnosis. The number of affected joints, swelling, and morning stiffness help guide assessment.

Persistent symptoms deserve a clinician's review. A hot, swollen joint with fever should be assessed promptly.

### 27. Osteoarthritis

Preview: `/demo answer 27`

Keywords: osteoarthritis

Osteoarthritis is a joint condition that can cause pain and stiffness. Management is tailored to the affected joints and how symptoms limit activities.

A clinician can discuss appropriate movement, rehabilitation, and other options for your circumstances.

### 28. Rheumatoid arthritis

Preview: `/demo answer 28`

Keywords: rheumatoid arthritis

Rheumatoid arthritis is an inflammatory condition that can affect joints and other parts of the body. Persistent joint swelling or morning stiffness deserves assessment.

A clinician may refer you to a specialist. Treatment decisions depend on a confirmed diagnosis.

### 29. Gout

Preview: `/demo answer 29`

Keywords: gout

Gout can cause episodes of painful joint inflammation, but a painful swollen joint can have other causes too. A clinician can distinguish these possibilities.

Do not assume a first episode is gout. A hot joint with fever needs prompt assessment.

### 30. Sprains

Preview: `/demo answer 30`

Keywords: sprain, twisted ankle

A sprain involves an injured ligament, but pain after an injury may also come from a fracture or other damage. Assessment depends on severity and function.

Seek care for deformity, numbness, or inability to bear weight.

### 31. Bone health

Preview: `/demo answer 31`

Keywords: osteoporosis, bone health

Osteoporosis makes bones more vulnerable to fractures. Assessment may consider age, fracture history, medicines, and other risk factors.

Ask a clinician whether a bone density test or prevention plan is appropriate for you.

### 32. Chronic pain

Preview: `/demo answer 32`

Keywords: chronic pain, persistent pain

Persistent pain can affect sleep, mood, and everyday activities. A care plan may involve several approaches rather than a single treatment.

Describe your main limitations and goals to a clinician. New or changing symptoms still need assessment.

### 33. Cough

Preview: `/demo answer 33`

Keywords: cough, coughing

A cough has many possible causes. Its duration, associated fever, breathing symptoms, and any blood matter when deciding what assessment is needed.

Seek medical advice for a persistent cough. Severe breathing difficulty requires emergency help.

### 34. Sore throat

Preview: `/demo answer 34`

Keywords: sore throat, throat pain

A sore throat can have several causes, and antibiotics are not always appropriate. A clinician can assess persistent or severe symptoms.

Difficulty breathing, inability to swallow, or rapidly worsening swelling needs urgent medical help.

### 35. Common cold

Preview: `/demo answer 35`

Keywords: common cold, runny nose

A common cold is a viral respiratory infection, although similar symptoms can occur with other illnesses. Symptoms and risk factors help decide whether assessment is needed.

Seek advice if symptoms worsen, persist, or are accompanied by breathing difficulty.

### 36. Influenza

Preview: `/demo answer 36`

Keywords: influenza, flu

Influenza is a viral respiratory illness that can be more serious for some people. A clinician can advise on testing and treatment when appropriate.

Seek prompt advice if you are at higher risk or become very unwell.

### 37. COVID-19

Preview: `/demo answer 37`

Keywords: covid, coronavirus

COVID-19 can cause respiratory and other symptoms. Current testing and treatment advice depends on local guidance and individual risk.

Check your local health authority or clinician for current advice. Severe breathing difficulty needs emergency care.

### 38. Sinus symptoms

Preview: `/demo answer 38`

Keywords: sinus, sinusitis

Sinus symptoms can include facial pressure and nasal congestion. A clinician can assess symptoms that persist, worsen, or keep returning.

Severe swelling around an eye or changes in vision require urgent medical assessment.

### 39. Seasonal allergies

Preview: `/demo answer 39`

Keywords: hay fever, pollen allergy, seasonal allergy

Seasonal allergies can affect the nose and eyes. A pharmacist or clinician can help assess whether allergy treatments are suitable for you.

Tell them about other medicines and conditions. Breathing difficulty or throat swelling needs urgent help.

### 40. Asthma

Preview: `/demo answer 40`

Keywords: asthma, inhaler

Asthma can cause episodes of wheezing, coughing, and breathlessness. A clinician can review your symptoms, inhaler technique, and personal action plan.

Follow your prescribed plan. Severe breathing difficulty or symptoms that do not improve need urgent medical help.

### 41. COPD

Preview: `/demo answer 41`

Keywords: copd, chronic obstructive

COPD is a long-term lung condition that can affect breathing. Management depends on assessment, symptoms, and exacerbation history.

If breathing is worse than usual, contact your clinical team promptly. Severe difficulty breathing requires emergency care.

### 42. Pneumonia

Preview: `/demo answer 42`

Keywords: pneumonia

Pneumonia is an infection affecting the lungs. Diagnosis and treatment require medical assessment rather than a symptom match in chat.

Seek medical advice for concerning cough, fever, or breathlessness, especially if you are becoming more unwell.

### 43. Breathlessness

Preview: `/demo answer 43`

Keywords: shortness of breath, breathless, difficulty breathing

Breathlessness has many possible causes and should not be self-diagnosed. New or worsening symptoms need medical advice.

If breathing is severe, you cannot speak normally, or your lips become blue or grey, call emergency services immediately.

### 44. Smoking cessation

Preview: `/demo answer 44`

Keywords: stop smoking, quit smoking, smoking cessation

Stopping smoking can support long-term health, and structured support can help. A clinician or pharmacist can discuss suitable options and a plan for cravings.

Your smoking history and other medicines may affect which options are appropriate.

### 45. Blood pressure

Preview: `/demo answer 45`

Keywords: blood pressure, hypertension

Blood pressure is interpreted using repeated measurements and your overall health. A single reading does not always establish a diagnosis.

Discuss a pattern of elevated readings with a clinician. Do not change prescribed medicines based on a chat response.

### 46. Cholesterol

Preview: `/demo answer 46`

Keywords: cholesterol, lipid

Cholesterol results are considered alongside other cardiovascular risk factors. The meaning of a result depends on the type of cholesterol and your medical history.

A clinician can explain your results and whether lifestyle changes or treatment are appropriate.

### 47. Palpitations

Preview: `/demo answer 47`

Keywords: palpitations, racing heart, skipping beats

Palpitations are sensations of a racing, fluttering, or irregular heartbeat. Note their duration and any accompanying symptoms.

Seek medical assessment for new or recurring episodes. Palpitations with chest pain, fainting, or severe breathlessness need urgent help.

### 48. Heart failure

Preview: `/demo answer 48`

Keywords: heart failure

Heart failure means the heart is not pumping as effectively as needed. Symptoms and treatment plans vary between people.

Contact your clinical team about worsening swelling or breathlessness. Follow your prescribed plan rather than changing fluid intake or medicines yourself.

### 49. Leg swelling

Preview: `/demo answer 49`

Keywords: leg swelling, swollen leg, swollen ankle

Leg swelling can have different causes. New swelling on one side, especially with pain or redness, needs prompt medical assessment.

Swelling with chest pain or breathlessness may be an emergency. Seek immediate medical help in that situation.

### 50. Diabetes

Preview: `/demo answer 50`

Keywords: diabetes, diabetic

Diabetes affects how the body manages blood glucose. Care plans may include monitoring, food choices, activity, and medicines depending on the type and individual needs.

Discuss concerns with your diabetes team and avoid changing treatment without their guidance.

### 51. Low blood glucose

Preview: `/demo answer 51`

Keywords: hypoglycemia, hypoglycaemia, low blood sugar

Low blood glucose can be serious, especially for people taking certain diabetes medicines. Follow the personalized treatment plan given by your diabetes team.

If someone is unconscious or cannot swallow safely, do not give food or drink. Call emergency services.

### 52. High blood glucose

Preview: `/demo answer 52`

Keywords: hyperglycemia, hyperglycaemia, high blood sugar

High blood glucose needs interpretation alongside symptoms and your diabetes plan. Your clinical team can advise on monitoring and next steps.

Vomiting, confusion, unusual breathing, or marked drowsiness with high glucose requires urgent medical assessment.

### 53. HbA1c

Preview: `/demo answer 53`

Keywords: hba1c, a1c

HbA1c reflects average blood glucose over roughly the previous two to three months. Targets depend on individual circumstances and the clinical context.

Ask your clinician how your result compares with your personal target and whether follow-up is needed.

### 54. Thyroid health

Preview: `/demo answer 54`

Keywords: thyroid, hypothyroidism, hyperthyroidism

The thyroid produces hormones that influence many body functions. Symptoms alone cannot confirm whether it is underactive or overactive.

A clinician can interpret thyroid blood tests alongside your history and medicines. Do not adjust thyroid treatment yourself.

### 55. Anemia

Preview: `/demo answer 55`

Keywords: anemia, anaemia, low hemoglobin

Anemia means a reduced level of hemoglobin or healthy red blood cells. There are several causes, so treatment depends on the reason.

A clinician can interpret blood tests. Taking iron without checking the cause may not address the problem.

### 56. Iron deficiency

Preview: `/demo answer 56`

Keywords: iron deficiency, ferritin

Iron tests help assess iron stores, but results need clinical interpretation. Low iron can have different causes, including blood loss or reduced intake.

Ask your clinician about the cause and a suitable plan rather than choosing a supplement dose in chat.

### 57. Vitamin B12

Preview: `/demo answer 57`

Keywords: b12, vitamin b12

Vitamin B12 supports blood cells and the nervous system. A low result needs interpretation alongside symptoms and possible causes.

A clinician can advise on further tests and replacement options. Mention any numbness or balance changes promptly.

### 58. Vitamin D

Preview: `/demo answer 58`

Keywords: vitamin d

Vitamin D is involved in bone health. Whether testing or supplementation is useful depends on your circumstances and local guidance.

Ask a clinician or pharmacist before using high-dose supplements, especially if you have other conditions or take medicines.

### 59. Abdominal pain

Preview: `/demo answer 59`

Keywords: abdominal pain, stomach pain, belly pain

Abdominal pain has many causes. Where it occurs, how it began, and symptoms such as vomiting or fever help guide assessment.

Sudden severe pain, a rigid abdomen, collapse, or pain with pregnancy concerns needs urgent medical help.

### 60. Nausea

Preview: `/demo answer 60`

Keywords: nausea, feeling sick

Nausea can relate to illness, medicines, pregnancy, or other causes. Its duration and accompanying symptoms matter.

A clinician can assess persistent or unexplained nausea. Seek prompt advice if you cannot keep fluids down or feel very unwell.

### 61. Vomiting

Preview: `/demo answer 61`

Keywords: vomiting, throwing up

Vomiting can lead to dehydration and has many possible causes. Note how often it happens and whether fluids stay down.

Blood in vomit, severe pain, confusion, or signs of significant dehydration need urgent medical assessment.

### 62. Diarrhea

Preview: `/demo answer 62`

Keywords: diarrhea, diarrhoea

Diarrhea can follow infections, medicines, or other digestive problems. A clinician can assess persistent symptoms or episodes with other concerning features.

Seek prompt advice for blood in the stool, severe pain, dehydration, or a very unwell child.

### 63. Constipation

Preview: `/demo answer 63`

Keywords: constipation, constipated

Constipation involves difficult or infrequent bowel movements, but normal patterns differ. Medicines and other factors can contribute.

Discuss persistent or new bowel changes with a clinician. Severe abdominal pain with vomiting or inability to pass gas needs urgent assessment.

### 64. Heartburn

Preview: `/demo answer 64`

Keywords: heartburn, acid reflux, gerd

Heartburn is a burning sensation often associated with reflux, but chest discomfort can have other causes. A clinician can assess persistent symptoms.

Difficulty swallowing or unexplained weight loss deserves assessment. Sudden chest pain with sweating or breathlessness needs emergency help.

### 65. Irritable bowel syndrome

Preview: `/demo answer 65`

Keywords: ibs, irritable bowel

Irritable bowel syndrome can involve abdominal discomfort and changes in bowel habits. Diagnosis requires considering other possible explanations.

A clinician can help tailor a management plan. Blood in stools or unexplained weight loss should not be attributed to IBS without assessment.

### 66. Inflammatory bowel disease

Preview: `/demo answer 66`

Keywords: ibd, crohn, ulcerative colitis

Inflammatory bowel disease includes conditions such as Crohn's disease and ulcerative colitis. It differs from irritable bowel syndrome.

A specialist can guide monitoring and treatment. Contact your care team if established symptoms change or worsen.

### 67. Celiac disease

Preview: `/demo answer 67`

Keywords: celiac, coeliac, gluten

Celiac disease is an immune-related condition associated with gluten. Testing and diagnosis should be discussed with a clinician.

Ask about testing before making a major dietary change, since avoiding gluten can affect some test results.

### 68. Hemorrhoids

Preview: `/demo answer 68`

Keywords: hemorrhoids, haemorrhoids, piles

Hemorrhoids can cause discomfort and bleeding, but rectal bleeding can have other causes. A clinician can assess new or recurrent bleeding.

Heavy bleeding, dizziness, or black stools needs urgent medical advice.

### 69. Swallowing difficulty

Preview: `/demo answer 69`

Keywords: difficulty swallowing, dysphagia

Difficulty swallowing may involve the throat or esophagus and needs medical assessment, especially if it persists or worsens. Describe whether solids, liquids, or both are difficult.

Choking, breathing difficulty, or inability to swallow saliva requires urgent help.

### 70. Gallstones

Preview: `/demo answer 70`

Keywords: gallstone, gallstones

Gallstones can sometimes cause abdominal pain, but symptoms do not confirm the diagnosis. A clinician may use examination and imaging to assess the cause.

Pain with fever or yellowing of the skin or eyes needs prompt medical assessment.

### 71. Liver health

Preview: `/demo answer 71`

Keywords: liver, jaundice

Liver blood tests measure different things and need interpretation with your medical history. A single abnormal result does not explain the cause.

New yellowing of the skin or eyes should be assessed promptly. Discuss medicines and supplements with your clinician.

### 72. Kidney health

Preview: `/demo answer 72`

Keywords: kidney disease, kidney function, egfr

Kidney function is assessed using blood and urine tests, often over time. The meaning of a result depends on your history and other findings.

A clinician can explain your results and whether monitoring or specialist assessment is needed.

### 73. Urinary symptoms

Preview: `/demo answer 73`

Keywords: uti, urinary infection, burning urine

Burning or frequent urination can have several causes, including infection. A clinician can assess symptoms and decide whether testing is needed.

Seek prompt medical advice if you have fever, back pain, pregnancy, or feel very unwell.

### 74. Kidney stones

Preview: `/demo answer 74`

Keywords: kidney stone, kidney stones

Kidney stones can cause significant pain, but other conditions may feel similar. Medical assessment may involve urine tests and imaging.

Pain with fever, inability to pass urine, or severe vomiting needs urgent medical attention.

### 75. Urinary leakage

Preview: `/demo answer 75`

Keywords: incontinence, urine leakage

Urinary leakage has different patterns and possible causes. Note whether it happens with coughing, urgency, or difficulty emptying the bladder.

A clinician can discuss assessment and suitable management. You do not have to accept it as unavoidable.

### 76. Prostate concerns

Preview: `/demo answer 76`

Keywords: prostate, weak urine stream

Urinary symptoms can have several causes, including prostate conditions. A clinician can assess changes in flow, frequency, or discomfort.

Inability to pass urine needs urgent medical assessment. Testing decisions depend on your symptoms and circumstances.

### 77. Menstrual concerns

Preview: `/demo answer 77`

Keywords: period pain, menstrual, heavy periods

Menstrual pain and bleeding patterns vary, but symptoms that disrupt everyday life deserve assessment. Tracking timing and severity can help.

Very heavy bleeding, fainting, or severe pain with possible pregnancy needs urgent medical advice.

### 78. Endometriosis

Preview: `/demo answer 78`

Keywords: endometriosis

Endometriosis can cause pelvic pain and other symptoms, but a symptom pattern alone does not confirm it. Persistent pain deserves a clinician's assessment.

A record of pain in relation to your menstrual cycle can help the discussion.

### 79. Menopause

Preview: `/demo answer 79`

Keywords: menopause, hot flush, hot flash

Menopause can involve changes in periods, temperature regulation, sleep, and other symptoms. Options for managing symptoms depend on individual risks and preferences.

A clinician can discuss suitable approaches. Bleeding after menopause should be assessed.

### 80. Pregnancy questions

Preview: `/demo answer 80`

Keywords: pregnancy, pregnant

Pregnancy care and advice depend on the stage of pregnancy and your medical history. Your maternity team can help with symptoms, medicines, and routine appointments.

Severe pain, heavy bleeding, fainting, or concerning changes in fetal movement need prompt medical advice.

### 81. Prenatal care

Preview: `/demo answer 81`

Keywords: prenatal, antenatal

Prenatal care monitors pregnancy and provides a chance to discuss symptoms, screening, and birth plans. Appointment schedules vary by location and personal needs.

Keep a list of questions and contact your maternity team about new concerns.

### 82. Contraception

Preview: `/demo answer 82`

Keywords: contraception, birth control

Contraception options differ in how they are used and which people they suit. Medical history and other medicines can affect the choice.

A clinician or pharmacist can discuss options. Ask promptly about time-sensitive advice after unprotected sex or a contraceptive failure.

### 83. Sexual health

Preview: `/demo answer 83`

Keywords: sexual health, sti, sexually transmitted

Sexually transmitted infections may cause symptoms or none at all. Testing decisions depend on exposure and local services.

A sexual health clinician can advise on testing and prevention. Avoid relying on symptoms alone to decide whether an infection is present.

### 84. Fertility

Preview: `/demo answer 84`

Keywords: fertility, infertility

Fertility assessment considers both partners where relevant, medical history, and how long pregnancy has been attempted. The right timing for assessment varies.

A clinician can explain available tests and support without assuming a cause from a short description.

### 85. Child health

Preview: `/demo answer 85`

Keywords: child health, child symptoms, pediatric

Children need assessment that takes age, behavior, feeding, and symptoms into account. A caregiver's observation of a change can be important.

Seek urgent help for breathing difficulty, unusual drowsiness, or a child who is not responding normally.

### 86. Vaccination

Preview: `/demo answer 86`

Keywords: vaccination, vaccine, immunization

Vaccination recommendations depend on age, previous vaccines, health conditions, travel, and local schedules. A clinician can check what is appropriate for you.

Use current guidance from your local health authority rather than a fixed schedule in this demo.

### 87. Rash

Preview: `/demo answer 87`

Keywords: rash, skin spots

A rash can have many causes. Its appearance, location, timing, and any fever or new medicines help guide assessment.

A rash with severe illness, breathing difficulty, or rapidly worsening symptoms requires prompt medical help.

### 88. Eczema

Preview: `/demo answer 88`

Keywords: eczema, atopic dermatitis

Eczema is a skin condition that can involve itch and inflammation. Management depends on severity, affected areas, and possible triggers.

A clinician can assess persistent symptoms or signs of infection and help choose suitable skin care.

### 89. Acne

Preview: `/demo answer 89`

Keywords: acne, pimples

Acne can affect both skin and confidence. Treatment choices depend on severity, scarring, age, and other circumstances such as pregnancy.

A clinician or pharmacist can help you choose suitable options rather than combining multiple products without guidance.

### 90. Psoriasis

Preview: `/demo answer 90`

Keywords: psoriasis

Psoriasis is an inflammatory condition that can affect the skin and sometimes joints. A clinician can assess the pattern and discuss management.

Mention joint pain or swelling as well as skin changes, since it may affect the assessment.

### 91. Changing mole

Preview: `/demo answer 91`

Keywords: mole, skin cancer

A new or changing mole, or a skin lesion that does not heal, deserves assessment by a clinician. A description or photo alone cannot reliably rule out a serious condition.

Note changes in size, shape, color, or bleeding.

### 92. Eye discomfort

Preview: `/demo answer 92`

Keywords: eye pain, red eye, eye discomfort

Eye discomfort or redness can have different causes. A clinician can assess symptoms, contact lens use, and any injury.

Sudden loss of vision, severe eye pain, or a painful red eye with vision changes needs urgent medical care.

### 93. Dry eyes

Preview: `/demo answer 93`

Keywords: dry eyes, dry eye

Dry eyes can cause irritation, grittiness, or fluctuating comfort. A pharmacist or eye care professional can assess suitable options.

Persistent symptoms deserve review. Do not assume severe pain or a sudden vision change is simply dryness.

### 94. Ear symptoms

Preview: `/demo answer 94`

Keywords: ear pain, earache, ear infection

Ear pain can arise from the ear or nearby structures. A clinician can assess persistent pain, discharge, or hearing changes.

Seek prompt medical advice for marked swelling, severe illness, or symptoms following an injury.

### 95. Hearing changes

Preview: `/demo answer 95`

Keywords: hearing loss, tinnitus, ringing ears

Hearing changes and ringing in the ears have several possible causes. An ear examination and hearing assessment may help.

Sudden hearing loss needs urgent medical assessment rather than waiting for a routine appointment.

### 96. Dental pain

Preview: `/demo answer 96`

Keywords: toothache, dental pain, gum pain

Dental pain usually needs a dentist's assessment to identify the cause. Pain relief alone does not resolve an underlying dental problem.

Facial swelling with trouble swallowing or breathing needs urgent medical help.

### 97. Medication safety

Preview: `/demo answer 97`

Keywords: medicine safety, medication, medicine

Use medicines according to the prescription or product instructions. A pharmacist can help explain timing, side effects, and interactions.

Share a complete medicine and supplement list with your clinician. Do not start, stop, or change prescribed treatment based on this demo.

### 98. Antibiotics

Preview: `/demo answer 98`

Keywords: antibiotic, antibiotics

Antibiotics treat certain bacterial infections and are not suitable for every illness. A clinician decides whether they are appropriate.

Follow the prescribed instructions and ask a pharmacist about problems. Do not use leftover antibiotics or someone else's prescription.

### 99. Blood test results

Preview: `/demo answer 99`

Keywords: blood test, lab result, test result

A blood test result needs its units, laboratory reference range, and clinical context. A value outside the range does not by itself establish a diagnosis.

Ask your clinician what the test was checking and whether repeat testing or follow-up is needed.

### 100. Preparing for a checkup

Preview: `/demo answer 100`

Keywords: checkup, check up, doctor appointment

For a checkup, prepare a short list of concerns, your medicines and supplements, and relevant family history. Ask which preventive services suit your circumstances.

You can keep identifying details out of this chat and bring them directly to your clinician.
