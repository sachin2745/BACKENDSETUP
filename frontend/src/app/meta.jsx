// components/Meta.js
import Head from 'next/head';

const Meta = ({ title, description, keywords, schema }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Head>
  );
};

export default Meta;