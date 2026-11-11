/**
 * AutoScript Generator for QuickJob Tracker
 * 
 * Generates an executable JavaScript snippet that fills the "Add New Job" form
 * on the tracker web app when pasted into the browser console.
 * 
 * Features:
 * - Robust React / Vue form synchronization using HTMLInputElement.prototype native setters.
 * - Dispatches 'input', 'change', and 'blur' bubbling events.
 * - Safely escapes multiline job descriptions, quotes, and special characters via JSON.stringify.
 * - Logs field-by-field diagnostic feedback in the destination console.
 */

export interface AutoScriptJobData {
  jobTitle: string;
  company: string;
  location?: string;
  jobType?: string;
  salary?: string;
  experienceRequired?: string;
  keySkills?: string[] | string;
  applicationUrl?: string;
  careerPageUrl?: string;
  jobDescription?: string;
}

export function generateAutoScript(data: AutoScriptJobData): string {
  const safeData = {
    title: data.jobTitle || '',
    company: data.company || '',
    location: data.location || 'Remote',
    jobType: data.jobType || 'Full-time',
    salary: data.salary || '',
    experience: data.experienceRequired || '',
    skills: Array.isArray(data.keySkills) ? data.keySkills.join(', ') : (data.keySkills || ''),
    url: data.applicationUrl || data.careerPageUrl || '',
    careerUrl: data.careerPageUrl || data.applicationUrl || '',
    description: data.jobDescription || '',
  };

  return `(() => {
  // QuickJob AutoScript Form Filler
  const job = ${JSON.stringify(safeData, null, 2)};

  console.log("%c[QuickJob AutoScript] Starting form autofill...", "color: #8B5CF6; font-weight: bold; font-size: 13px;");

  function setFieldValue(el, val) {
    if (!el || val === undefined || val === null) return false;
    try {
      const isInput = el instanceof HTMLInputElement;
      const isTextarea = el instanceof HTMLTextAreaElement;
      const isSelect = el instanceof HTMLSelectElement;

      if (isInput || isTextarea) {
        const proto = isInput ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
        if (descriptor && descriptor.set) {
          descriptor.set.call(el, val);
        } else {
          el.value = val;
        }
      } else if (isSelect) {
        el.value = val;
      } else {
        el.innerText = val;
      }

      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
      return true;
    } catch (e) {
      console.warn("[QuickJob AutoScript] Could not set value on element:", el, e);
      return false;
    }
  }

  function findByLabel(patterns) {
    const labels = Array.from(document.querySelectorAll('label, .form-label, span, p'));
    for (const pat of patterns) {
      const regex = typeof pat === 'string' ? new RegExp(pat, 'i') : pat;
      for (const lbl of labels) {
        if (regex.test(lbl.textContent || '')) {
          // 1. Label with for attribute
          const forId = lbl.getAttribute('for');
          if (forId) {
            const el = document.getElementById(forId);
            if (el) return el;
          }
          // 2. Input/textarea inside label
          const inside = lbl.querySelector('input, textarea, select');
          if (inside) return inside;
          // 3. Next sibling or near parent container
          const parent = lbl.closest('.form-group, div, fieldset');
          if (parent) {
            const sibling = parent.querySelector('input:not([type="hidden"]), textarea, select');
            if (sibling && sibling !== lbl) return sibling;
          }
        }
      }
    }
    return null;
  }

  function findBySelectors(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  const results = { filled: [], missing: [] };

  // 1. Job Title
  const titleField = findByLabel(['job\\\\s*title', 'title']) || 
                     findBySelectors(['input[name*="title" i]', 'input[placeholder*="title" i]', '#job_title', '#title']);
  if (setFieldValue(titleField, job.title)) {
    results.filled.push('Job Title: "' + job.title + '"');
  } else {
    results.missing.push('Job Title field');
  }

  // 2. Company
  const companyField = findByLabel(['company\\\\s*\\\\*', '^company$']) || 
                       findBySelectors(['input[name*="company" i]:not([name*="url" i])', 'input[placeholder*="company" i]:not([placeholder*="url" i])', '#company']);
  if (setFieldValue(companyField, job.company)) {
    results.filled.push('Company: "' + job.company + '"');
  } else {
    results.missing.push('Company field');
  }

  // 3. Location / Remote
  const locField = findByLabel(['location', 'remote']) || 
                   findBySelectors(['input[name*="location" i]', 'input[placeholder*="location" i]', '#location']);
  if (setFieldValue(locField, job.location)) {
    results.filled.push('Location: "' + job.location + '"');
  } else {
    results.missing.push('Location field');
  }

  // 4. Job Link / Career Page URL
  const careerUrlField = findByLabel(['career\\\\s*page\\\\s*url', 'company\\\\s*career']) ||
                         findBySelectors(['input[name*="career" i]', 'input[placeholder*="career" i]']);
  if (setFieldValue(careerUrlField, job.careerUrl)) {
    results.filled.push('Career Page URL: "' + job.careerUrl + '"');
  }

  // 5. Application Website / URL
  const appUrlField = findByLabel(['application\\\\s*website', 'application\\\\s*url', 'job\\\\s*link', 'website\\\\s*/\\\\s*url']) ||
                      findBySelectors(['input[name*="application_url" i]', 'input[name*="url" i]', 'input[placeholder*="http" i]']);
  if (setFieldValue(appUrlField, job.url)) {
    results.filled.push('Application URL: "' + job.url + '"');
  } else if (!careerUrlField) {
    results.missing.push('Job Link / Application URL field');
  }

  // 6. Salary (optional)
  if (job.salary) {
    const salaryField = findByLabel(['salary', 'compensation']) || findBySelectors(['input[name*="salary" i]', 'input[placeholder*="salary" i]']);
    if (setFieldValue(salaryField, job.salary)) {
      results.filled.push('Salary: "' + job.salary + '"');
    }
  }

  // 7. Experience (optional)
  if (job.experience) {
    const expField = findByLabel(['experience']) || findBySelectors(['input[name*="experience" i]', 'input[placeholder*="experience" i]']);
    if (setFieldValue(expField, job.experience)) {
      results.filled.push('Experience: "' + job.experience + '"');
    }
  }

  // 8. Job Description / Insights
  const jdField = findByLabel(['job\\\\s*description', 'insights', 'description']) ||
                  findBySelectors(['textarea[name*="description" i]', 'textarea[placeholder*="description" i]', '#job_description', 'textarea']);
  if (setFieldValue(jdField, job.description)) {
    results.filled.push('Job Description (' + job.description.length + ' chars)');
  } else {
    results.missing.push('Job Description textarea');
  }

  // Output summary
  console.log("%c[QuickJob AutoScript] Summary:", "color: #8B5CF6; font-weight: bold;");
  if (results.filled.length > 0) {
    console.log("%c✅ Successfully filled:\\n" + results.filled.map(s => "  • " + s).join("\\n"), "color: #10B981;");
  }
  if (results.missing.length > 0) {
    console.warn("[QuickJob AutoScript] ⚠️ Could not automatically find selectors for:\\n" + results.missing.map(s => "  • " + s).join("\\n") + "\\nPlease verify the form fields are visible on screen.");
  }
})();`;
}
