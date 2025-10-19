# SEO Implementation Guide for MH Platform

## Overview

I've created SEO components and configuration files to improve your website's search engine optimization without editing your existing code.

## Files Created

### 1. `src/components/rusable/CanonicalLink.jsx`

- Simple component that automatically adds canonical links to each page
- Updates canonical URL based on current route

### 2. `src/components/rusable/SEOHead.jsx`

- Comprehensive SEO component that handles:
  - Page titles
  - Meta descriptions
  - Meta keywords
  - Open Graph tags (for social media sharing)
  - Twitter Card tags
  - Canonical links

### 3. `src/config/seoConfig.js`

- Centralized SEO configuration
- Page-specific SEO settings
- Dynamic SEO generators for dynamic content
- Helper functions

### 4. `src/examples/SEOUsageExample.jsx`

- Examples showing how to use SEO components in your existing pages

## How to Implement (Without Editing Your Code)

### Option 1: Add to App.jsx (Recommended)

Add the CanonicalLink component to your App.jsx:

```jsx
import CanonicalLink from "./components/rusable/CanonicalLink.jsx";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <CanonicalLink /> {/* Add this line */}
        <ScrollToTop />
        <Navbar />
        {/* Rest of your existing code */}
      </BrowserRouter>
    </>
  );
};
```

### Option 2: Add to Individual Pages

For more control, add SEOHead to specific pages:

```jsx
import SEOHead from "../components/rusable/SEOHead";
import { getPageSEO } from "../config/seoConfig";

// In your component
const YourComponent = () => {
  const seoData = getPageSEO("home"); // or any page name

  return (
    <>
      <SEOHead {...seoData} />
      {/* Your existing component content */}
    </>
  );
};
```

### Option 3: Dynamic SEO for Dynamic Content

For pages with dynamic content (like lessons, exams):

```jsx
import SEOHead from "../components/rusable/SEOHead";
import { generateLessonSEO } from "../config/seoConfig";

const LessonComponent = ({ lessonTitle, academicYear }) => {
  const seoData = generateLessonSEO(lessonTitle, academicYear);

  return (
    <>
      <SEOHead {...seoData} />
      {/* Your existing component content */}
    </>
  );
};
```

## Benefits

1. **Canonical Links**: Prevents duplicate content issues
2. **Dynamic Titles**: Each page has unique, descriptive titles
3. **Meta Descriptions**: Better search result snippets
4. **Open Graph**: Better social media sharing
5. **Structured Data**: Better search engine understanding

## Customization

1. **Update Domain**: Change `baseUrl` in `seoConfig.js` to your actual domain
2. **Customize Content**: Modify SEO text in `seoConfig.js` to match your content
3. **Add New Pages**: Add new page configurations to the `pages` object

## Testing

1. Use browser developer tools to inspect the `<head>` section
2. Check that canonical links are present and correct
3. Verify meta tags are updating based on the current page
4. Test social media sharing to see Open Graph tags in action

## Notes

- All components are designed to work with your existing React Router setup
- No changes to your existing code are required
- Components automatically clean up when unmounted
- SEO data updates automatically when routes change
