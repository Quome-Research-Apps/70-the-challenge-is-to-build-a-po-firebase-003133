# **App Name**: ElectoralLens

## Core Features:

- Data Upload & Parsing: Securely upload election data (CSV, GeoJSON) directly in-browser without server-side processing. Data is parsed and prepared for visualization.
- Interactive Geographic Map: Display election results on an interactive map, highlighting voter turnout and other key metrics at different geographic levels (e.g., precinct, county, state).
- Customizable Choropleth Layers: Choose election statistics and then render them visually using different color mappings. Alter layer properties in real-time to explore.
- Descriptive Metric Tiles: AI-powered tool suggests a variety of univariate statistics relevant to the visualization. Aggregate metrics are updated automatically when the data selection changes.
- Dynamic Chart Generation: Generate bar charts, scatter plots, and other charts based on selected data dimensions and map regions for comparison.
- Filtering and Highlighting: Filter data based on various criteria (e.g., demographics, turnout rates) and highlight specific regions or data points on the map and charts.
- Ephemeral Session: The application operates in a single-session mode; all uploaded data and analysis is purged from memory upon closing the browser.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust, authority, and intelligence related to data analysis.
- Background color: Light gray (#ECEFF1) for a clean, professional look.
- Accent color: A vibrant orange (#FF9800) to highlight interactive elements and key insights.
- Body and headline font: 'Inter' sans-serif for clear data presentation.
- Use clean, minimalist icons to represent different data filters and chart types.
- A clean, card-based layout to present key insights, descriptive stats, and allow the data itself to be the main focus of the interface.
- Subtle transitions when zooming on the map and filtering selections, to maintain user orientation.