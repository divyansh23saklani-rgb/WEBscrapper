# Project Name

The Merchant Evaluation Tool analyzes merchant websites to assess credibility, functionality,
and overall reliability. It checks for MCC classification, product pricing, website usability, 
broken links, content quality, domain validity, SSL, traffic patterns,and potential security
risks—providing a comprehensive report and score for quick evaluation.

------------------------------------------------------------------------------------------------------

## Prerequisites

Before setting up the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- [Python](https://www.python.org/) 
- [pip](https://pip.pypa.io/en/stable/) 
- [Git](https://git-scm.com/)
- [uvicorn] pip install uvicorn
- [fastapi] pip install fastapi
- [torch] pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124


------------------------------------------------------------------------------------------------------

## Installation

Follow these steps to get the project running locally:
1. **create a virtual environment**
    python -m venv venv
    # Activate it
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate


2. **Clone the repository**

```bash
git clone <your-repo-url>
cd <your-project-folder>


3  **INSTALL FRONTEND DEPENDENCIES**
    command -- " npm install "


4  **INSTALL BACKEND DEPENDENCIES**
    command - p "pip install -r requirements.txt"
    pip install language_tool_python
    pip install sentence_transformers 
    pip install transformers
    pip install pydantic
    pip install bs4
    pip install dotenv
    pip install groq
    pip install google.genai
    pip install genai
    pip install whois
    pip install datasets
    pip install accelerate
    pip install python-multipart


5  **Setup env variable**
    create folder config and add .env file store your gemini api key
    format to be used -- gemini_api_key = " "


6  **RUNNING AND TERMINATION OF PROCESS"
    #navigate to root folder
    "npm run dev"

    #terminatinig 
        "ctrl+c"

NOTE - For error - PERMISSION DENIED 
  run these commands 
        "chmod +x node_modules/.bin/concurrently"
