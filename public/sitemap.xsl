<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
      <head>
        <title>Sitemap XML - Safarihoo</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #09090b;
            color: #f4f4f5;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: #18181b;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 20px;
            margin-bottom: 24px;
          }
          h1 {
            font-size: 24px;
            margin: 0;
            color: #ffffff;
          }
          p.desc {
            color: #a1a1aa;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          th {
            text-align: left;
            padding: 12px;
            background: #27272a;
            color: #38bdf8;
            font-weight: 600;
            border-radius: 6px;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: #e4e4e7;
          }
          tr:hover td {
            background: rgba(255, 255, 255, 0.02);
          }
          a {
            color: #38bdf8;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .badge {
            background: rgba(56, 189, 248, 0.15);
            color: #38bdf8;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
          }
          .footer {
            margin-top: 32px;
            font-size: 12px;
            color: #71717a;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>Plan du site XML (Sitemap)</h1>
              <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 13px; font-weight: 500;">Safarihoo.com</p>
            </div>
            <span class="badge">Google / Bing XML Format</span>
          </div>
          <p class="desc">
            Ce fichier XML est automatiquement généré pour permettre aux moteurs de recherche (Google, Bing, Yahoo) d'indexer efficacement toutes les pages de Safarihoo.
          </p>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Priorité</th>
                <th>Fréquence</th>
                <th>Dernière mise à jour</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td><span class="badge"><xsl:value-of select="sitemap:priority"/></span></td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          <div class="footer">
            Safarihoo © 2026 – Comparateur de vols, hôtels et voyages au meilleur prix.
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
