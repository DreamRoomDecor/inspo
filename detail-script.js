document.addEventListener('DOMContentLoaded', function() {     
    const detailTitle = document.getElementById('detail-title');     
    const detailImageContainer = document.getElementById('detail-image-container');     
    const detailBody = document.getElementById('detail-body');     
    const relatedPostsContainer = document.getElementById('related-posts-container');     
    const params = new URLSearchParams(window.location.search);     
    const keywordFromQuery = params.get('q') || '';     
    const keyword = keywordFromQuery.replace(/-/g, ' ').trim();          
    
    // Set untuk menyimpan keyword yang sudah tampil agar tidak duplikat di related post     
    const displayedKeywords = new Set();     
    if (keyword) {         
        displayedKeywords.add(keyword.toLowerCase());     
    }          
    
    function capitalizeEachWord(str) {          
        if (!str) return '';          
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');      
    }          
    
    function generateSeoTitle(baseKeyword) {          
        const hookWords = ['Printable', 'Aesthetic', 'Minimalist', 'Boho', 'Modern', 'Abstract', 'Vintage', 'DIY', 'Beautiful', 'Digital'];          
        const suffixWords = ['Wall Art', 'Poster', 'Art Print', 'Digital Download', 'Decor'];         
        const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)];          
        const randomSuffix = suffixWords[Math.floor(Math.random() * suffixWords.length)];         
        return `${randomHook} ${capitalizeEachWord(baseKeyword)} ${randomSuffix}`;      
    }     
    
    function processSpintax(text) {         
        const spintaxPattern = /{([^{}]+)}/g;         
        while (spintaxPattern.test(text)) {             
            text = text.replace(spintaxPattern, (match, choices) => {                 
                const options = choices.split('|');                 
                return options[Math.floor(Math.random() * options.length)];             
            });         
        }         
        return text;     
    }     
    
    if (!keyword) {          
        detailTitle.textContent = 'Design Not Found';          
        detailBody.innerHTML = '<p>Sorry, the requested art could not be found. Please return to the <a href="index.html">homepage</a>.</p>';          
        if (relatedPostsContainer) {              
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';          
        }          
        return;      
    }     
    
    function populateMainContent(term) {         
        const newTitle = generateSeoTitle(term);         
        const capitalizedTermForArticle = capitalizeEachWord(term);         
        document.title = `${newTitle} | Home Decor Ideas`;         
        detailTitle.textContent = newTitle;         
        
        // Menambahkan kata "horizontal" ke query gambar agar hasil pencarian Bing lebih relevan dengan rasio 16:9
        const queryImage = term + " wall art decor horizontal";         
        // Mengubah resolusi request image menjadi 800x450 (16:9) agar tidak terlalu banyak terpotong (crop) oleh CSS
        const mainImageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(queryImage)}&w=800&h=450&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;         
        detailImageContainer.innerHTML = `<img src="${mainImageUrl}" alt="${newTitle}">`;         
        
        // Memperkaya variasi Spintax hook article yang disesuaikan dengan niche deskripsi.txt
        const spintaxTemplates = [
            `{Discover the best|Looking for amazing} <strong>${capitalizedTermForArticle}</strong> printable wall art {right here|today}! {Easy to download|Simple to style} and instantly {beautifies|elevates} your {space|room}.`,
            `{Don't know how to style your blank walls?|Craving a fresh look for your home?} Try this {special|aesthetic} <strong>${capitalizedTermForArticle}</strong> design. {Simple, beautiful, and full of character|It's guaranteed to be a new favorite}.`,
            `{Unlock the secret to the perfect room|Take your room to the next level} with this <strong>${capitalizedTermForArticle}</strong>! Our {digital download|instant decor idea} makes upgrading your interior {incredibly simple|effortless}.`,
            `{Elevate your space|Warm up your living area} with this incredible <strong>${capitalizedTermForArticle}</strong> design. It looks {fancy|stunning} but is {surprisingly affordable|perfect for a quick weekend makeover}.`
        ];
        
        const spintaxArticleTemplate = spintaxTemplates[Math.floor(Math.random() * spintaxTemplates.length)];
        detailBody.innerHTML = `<p>${processSpintax(spintaxArticleTemplate)}</p>`;     
    }     
    
    // Fungsi baru untuk mengambil 5 keyword acak dari keyword.txt     
    function appendRandomKeywords() {         
        fetch('keyword.txt')             
            .then(response => response.text())             
            .then(data => {                 
                const keywords = data.split('\n')                     
                    .map(k => k.trim())                     
                    .filter(k => k.length > 0 && !displayedKeywords.has(k.toLowerCase()));                                  
                
                if (keywords.length === 0) {                     
                    checkSectionDisplay();                     
                    return;                 
                }                                  
                
                for (let i = keywords.length - 1; i > 0; i--) {                     
                    const j = Math.floor(Math.random() * (i + 1));                     
                    [keywords[i], keywords[j]] = [keywords[j], keywords[i]];                 
                }                                  
                
                const selectedKeywords = keywords.slice(0, 5);                                  
                selectedKeywords.forEach(relatedTerm => {                     
                    displayedKeywords.add(relatedTerm.toLowerCase());                                          
                    const keywordForUrl = relatedTerm.replace(/\s/g, '-').toLowerCase();                     
                    const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;                                          
                    
                    // Gambar related posts tetap vertikal (400x600)
                    const queryImage = relatedTerm + " wall art poster";                     
                    const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(queryImage)}&w=400&h=600&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;                                          
                    
                    const newRelatedTitle = generateSeoTitle(relatedTerm);                     
                    const card = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newRelatedTitle}" loading="lazy"><div class="content-card-body"><h3>${newRelatedTitle}</h3></div></a></article>`;                     
                    relatedPostsContainer.innerHTML += card;                 
                });                                  
                checkSectionDisplay();             
            })             
            .catch(error => {                 
                console.error('Gagal mengambil keyword.txt:', error);                 
                checkSectionDisplay();             
            });     
    }     
    
    function checkSectionDisplay() {         
        if (relatedPostsContainer.innerHTML.trim() === '') {             
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';         
        } else {             
            relatedPostsContainer.closest('.related-posts-section').style.display = 'block';         
        }     
    }     
    
    function generateRelatedPosts(term) {         
        const script = document.createElement('script');         
        script.src = `https://suggestqueries.google.com/complete/search?client=youtube&jsonp=handleRelatedSuggest&hl=en&q=${encodeURIComponent(term)}`;         
        document.head.appendChild(script);         
        script.onload = () => script.remove();         
        script.onerror = () => {              
            relatedPostsContainer.innerHTML = '';              
            script.remove();              
            appendRandomKeywords();         
        }     
    }     
    
    window.handleRelatedSuggest = function(data) {         
        const suggestions = data[1];         
        relatedPostsContainer.innerHTML = '';         
        let relatedCount = 0;                  
        
        if (suggestions && suggestions.length > 0) {             
            suggestions.forEach(item => {                 
                const relatedTerm = typeof item === 'string' ? item : item[0];                 
                const termLower = relatedTerm ? relatedTerm.toLowerCase() : '';                                  
                if (!termLower || displayedKeywords.has(termLower) || relatedCount >= 5) return;                                  
                displayedKeywords.add(termLower);                 
                relatedCount++;                                  
                const keywordForUrl = relatedTerm.replace(/\s/g, '-').toLowerCase();                 
                const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;                                  
                
                // Gambar related posts tetap vertikal (400x600)
                const queryImage = relatedTerm + " wall art poster";                 
                const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(queryImage)}&w=400&h=600&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;                                  
                
                const newRelatedTitle = generateSeoTitle(relatedTerm);                 
                const card = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newRelatedTitle}" loading="lazy"><div class="content-card-body"><h3>${newRelatedTitle}</h3></div></a></article>`;                 
                relatedPostsContainer.innerHTML += card;             
            });         
        }                  
        appendRandomKeywords();     
    };     
    
    populateMainContent(keyword);     
    generateRelatedPosts(keyword); 
});
