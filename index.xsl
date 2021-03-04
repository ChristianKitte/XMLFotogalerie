<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><!--http://stackoverflow.com/questions/3387127/set-html5-doctype-with-xslt, No 46-->
	<xsl:output method="html" doctype-system="about:legacy-compat" encoding="utf-8" indent="yes"/>
	<xsl:template match="/">
    <html><!-- creation of meta, css ,links goes here -->
			<head>
				<meta charset="utf-8"/>
        <meta http-equiv="expires" content="0" />
        <meta name="author" content="Christian Kitte" />
        <meta name="date" content="2017-01-03" />
        <meta name="description" lang="de" content="Dies ist eine private Bildergalerie und Linksliste zum Thema Fotografieren" />
        <meta name="keywords" lang="de" content="foto, image, galerie, bildergalerie, fotogalerie, linksammlung, links" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
				<title>Just another Image Page (jaip)</title>
				<link rel="stylesheet" href="css/main.css"/>
				<script src="js/Loader.js">
          Leider unterstützt ihr Browser kein JavaScript
        </script>
			</head>
			<body>
        <!-- defines a eye catcher image -->
				<img>
					<xsl:attribute name="id">eyeCatcher</xsl:attribute>
					<xsl:attribute name="title">
						<xsl:value-of select="documentTemplate/siteImage/title"/>
					</xsl:attribute>
					<xsl:attribute name="src">
						<xsl:value-of select="documentTemplate/siteImage/source"/>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="documentTemplate/siteImage/alt"/>
					</xsl:attribute>
				</img>
        
        <!--creates a buttonbar for use within small devices -->
        <div id="smallButtonbar">
          <div class="smallButtonLeft">
            <button onclick="turnSmallButton('smallButtonLeft')">
              <span>toggle</span>
            </button>
          </div>
          <div class="smallButtonMiddle">
            <button onclick="turnSmallButton('smallButtonMiddle')">
              <span>toggle</span>
            </button>
          </div>
          <div class="smallButtonRight">
            <button onclick="turnSmallButton('smallButtonRight')">
              <span>toggle</span>
            </button>
          </div>
        </div>
        
        <!-- placeholder for prevImage -->
        <div id="previewImageContent" class="hidePreviewImage"/>
                  
        <!-- placeholder for content -->
				<div id="mainContent" onclick="onMainContentClicked()"/>
        
        <!--creates the main menue -->
				<nav>
					<xsl:attribute name="id">mainNav</xsl:attribute>
					<ul>
						<xsl:for-each select="documentTemplate/mainNavigation/mnItem">
							<li>
                <!--HIER KEIN ZEILENUMBRUCH MACHEN !!!-->
								<xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
								<!--__________________________________-->
								<xsl:choose>
									<xsl:when test="select='true'">
										<xsl:attribute name="class">selected</xsl:attribute>
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="class">unselected</xsl:attribute>
									</xsl:otherwise>
								</xsl:choose>
								<a>
									<xsl:attribute name="tabindex">
										<xsl:value-of select="tab"/>
									</xsl:attribute>
									<xsl:attribute name="href">#</xsl:attribute>
									<xsl:attribute name="tabindex">
										<xsl:value-of select="tab"/>
									</xsl:attribute>
									<xsl:attribute name="title">
										<xsl:value-of select="title"/>
									</xsl:attribute>
									<xsl:attribute name="onclick">
                    getContent('<xsl:value-of select="id"/>','<xsl:value-of select="source"/>','<xsl:value-of select="target"/>')
                  </xsl:attribute>
									<xsl:value-of select="caption"/>
								</a>
							</li>
						</xsl:for-each>
					</ul>
				</nav>
        <!-- creates image group navigation -->
				<nav>
					<xsl:attribute name="id">groupNav</xsl:attribute>
          <ul>
						<xsl:for-each select="documentTemplate/groupNavigation/gnItem">
							<li>
                <!--HIER KEIN ZEILENUMBRUCH MACHEN !!!-->
								<xsl:attribute name="id"><xsl:value-of select="id"/></xsl:attribute>
								<!--__________________________________-->
								<xsl:choose>
									<xsl:when test="select='true'">
										<xsl:attribute name="class">selected</xsl:attribute>
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="class">unselected</xsl:attribute>
									</xsl:otherwise>
								</xsl:choose>
								<figure>
                   <xsl:attribute name="onclick">
                   getImages('<xsl:value-of select="id"/>','<xsl:value-of select="target"/>')
                   </xsl:attribute>
                  
									<img>
										<xsl:attribute name="class">groupPreview</xsl:attribute>
										<xsl:attribute name="alt">
											<xsl:value-of select="alt"/>
										</xsl:attribute>
										<xsl:attribute name="title">
											<xsl:value-of select="title"/>
										</xsl:attribute>
										<xsl:attribute name="src">
											<xsl:value-of select="prevImage"/>
										</xsl:attribute>
									</img>
									<figcaption>
										<xsl:attribute name="class">groupDescriptorHead</xsl:attribute>
										<a>
											<xsl:attribute name="class">groupCaller</xsl:attribute>
											<xsl:attribute name="href">#</xsl:attribute>
											<xsl:attribute name="tabindex">
												<xsl:value-of select="tab"/>
											</xsl:attribute>
											<xsl:value-of select="caption"/>
										</a>
										<p>
											<xsl:attribute name="class">groupDescriptor</xsl:attribute>
											<xsl:value-of select="prevImageText"/>
										</p>
									</figcaption>
								</figure>
							</li>
						</xsl:for-each>
					</ul>
				</nav>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
