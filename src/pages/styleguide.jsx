/**
 * Style Guide page
 * This page displays the style guide demo component
 */

import React from 'react';
import StyleGuideDemo from '../components/StyleGuideDemo';
import { Layout } from '../components/Layout';

const StyleGuidePage = () => {
  return (
    <Layout>
      <StyleGuideDemo />
    </Layout>
  );
};

export default StyleGuidePage;
