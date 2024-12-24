// import { NextResponse } from 'next/server';

// interface ResumeData {
//   skills: string[];
//   experience: string;
//   education: string;
// }

// const normalizeText = (text: string): string => {
//   return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
// };

// const extractYearsOfExperience = (text: string): number => {
//   const experienceRegex = /(\d+)\+?\s*years?/i;
//   const match = experienceRegex.exec(text);
//   return match ? parseInt(match[1], 10) : 0;
// };

// const isSkillMatched = (resumeSkill: string, jdSkill: string): boolean => {
//   const normalizedResumeSkill = normalizeText(resumeSkill);
//   const normalizedJdSkill = normalizeText(jdSkill);
//   return normalizedResumeSkill === normalizedJdSkill;
// };

// const calculateScore = async (resume: ResumeData, jd) => {
//   let totalScore = 0;
//   const maxScore = 20;

//   // Normalize data
//   const normalizedResumeSkills = resume.skills.map(normalizeText);
//   const normalizedJdSkills = jd.jobDescriptionData.requiredSkills.map(normalizeText);
//   const normalizedResumeExperience = normalizeText(resume.experience);
//   const normalizedJdExperience = jd.jobDescriptionData.experience.map(normalizeText);
//   const normalizedResumeEducation = normalizeText(resume.education);
//   const normalizedJdQualifications = jd.jobDescriptionData.qualifications.map(normalizeText);

//   // Skills Matching
//   const matchedSkillsSet = new Set<string>(); // Use a Set to ensure unique skills
//   for (const resumeSkill of normalizedResumeSkills) {
//     for (const jdSkill of normalizedJdSkills) {
//       if (isSkillMatched(resumeSkill, jdSkill)) {
//         matchedSkillsSet.add(jdSkill); // Add the matched job description skill to the Set
//         break;
//       }
//     }
//   }
//   const matchedSkills = Array.from(matchedSkillsSet); // Convert Set to Array
//   const skillsScore = (matchedSkills.length / normalizedJdSkills.length) * 10;
//   totalScore += skillsScore;

//   // Experience Matching
//   const resumeYears = extractYearsOfExperience(normalizedResumeExperience);
//   const jdYears = normalizedJdExperience.map(extractYearsOfExperience);
//   const maxJdYears = Math.max(...jdYears, 0);

//   const experienceScore =
//     resumeYears >= maxJdYears ? 5 : resumeYears >= maxJdYears - 1 ? 3 : 0;
//   totalScore += experienceScore;

//   // Education Matching
//   const educationScore = normalizedJdQualifications.some(qual =>
//     normalizedResumeEducation.includes(qual)
//   )
//     ? 5
//     : 0;
//   totalScore += educationScore;

//   // Normalize Score to 100
//   const normalizedScore = (totalScore / maxScore) * 100;

//   return {
//     matchedSkills,
//     skillsScore,
//     experienceScore,
//     educationScore,
//     totalScore: normalizedScore,
//   };
// };

// export async function POST(request: Request) {
//   try {
//     const { resumeData, jdData } = await request.json();

//     if (!resumeData) {
//       console.error('Missing resume data');
//     }

//     if (!jdData) {
//       console.error('Missing job description data');
//     }

//     if (!resumeData || !jdData) {
//       console.error('Missing resume or job description data');
//       return NextResponse.json(
//         { error: 'Missing resume or job description data' },
//         { status: 400 }
//       );
//     }

//     if (
//       !Array.isArray(jdData.jobDescriptionData.requiredSkills) ||
//       !Array.isArray(jdData.jobDescriptionData.experience) ||
//       !Array.isArray(jdData.jobDescriptionData.qualifications)
//     ) {
//       console.error('Invalid job description data structure');
//       return NextResponse.json(
//         { error: 'Invalid job description data structure' },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(resumeData) || resumeData.some(resume =>
//       !Array.isArray(resume.skills) || typeof resume.experience !== 'string' || typeof resume.education !== 'string'
//     )) {
//       console.error('Invalid resume data structure');
//       return NextResponse.json(
//         { error: 'Invalid resume data structure' },
//         { status: 400 }
//       );
//     }

//     const results = await Promise.all(resumeData.map(async (resume: ResumeData) => ({
//       resume,
//       score: await calculateScore(resume, jdData),
//     })));

//     results.sort((a, b) => b.score.totalScore - a.score.totalScore);

//     return NextResponse.json({
//       message: 'Comparison completed successfully',
//       results,
//     });
//   } catch (error) {
//     console.error('Error in comparison API:', error);
//     return NextResponse.json(
//       { error: 'Failed to compare resume and job description' },
//       { status: 500 }
//     );
//   }
// }



