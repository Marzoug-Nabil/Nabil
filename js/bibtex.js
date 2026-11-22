/**
 * BibTeX entries for every publication, shared by the portfolio and the academic page.
 * Elements with data-bib="<key>" become "BibTeX" toggles with a copy button.
 */
window.BIBTEX = {
  fcvgan: `@article{marzoug2026fcvgan,
  title     = {FCVGAN: A Novel Generative Framework Integrating Fuzzy C-Means Clustering with Conditional VAE-GAN for Polyp Segmentation},
  author    = {Marzoug, Nabil and Akhloufi, Moulay A.},
  journal   = {Sensors},
  volume    = {26},
  number    = {19},
  pages     = {6095},
  year      = {2026},
  publisher = {MDPI},
  doi       = {10.3390/s26196095}
}`,
  vaereview: `@article{marzoug2026vae,
  title     = {Variational Autoencoders for Medical Image Segmentation: A Review},
  author    = {Marzoug, Nabil and Akhloufi, Moulay A.},
  journal   = {Journal of Imaging},
  volume    = {12},
  number    = {10},
  pages     = {481},
  year      = {2026},
  publisher = {MDPI},
  doi       = {10.3390/jimaging12100481}
}`,
  qunet: `@article{halab2025qunet,
  title     = {QU-Net: Quantum-Enhanced U-Net for Self Supervised Embedding and Classification of Skin Cancer Images},
  author    = {Halab, Khidhr and Marzoug, Nabil and El Meslouhi, Othmane and Abou Elassad, Zouhair Elamrani and Akhloufi, Moulay A.},
  journal   = {Big Data and Cognitive Computing},
  volume    = {10},
  number    = {1},
  pages     = {12},
  year      = {2025},
  publisher = {MDPI},
  doi       = {10.3390/bdcc10010012}
}`,
  dualbackbone: `@article{marzoug2025dualbackbone,
  title     = {Quantum-Enhanced Dual-Backbone Architecture for Accurate Gastrointestinal Disease Detection Using Endoscopic Imaging},
  author    = {Marzoug, Nabil and Halab, Khidhr and El Meslouhi, Othmane and Abou Elassad, Zouhair Elamrani and Akhloufi, Moulay A.},
  journal   = {BioMedInformatics},
  volume    = {5},
  number    = {3},
  pages     = {51},
  year      = {2025},
  publisher = {MDPI},
  doi       = {10.3390/biomedinformatics5030051}
}`,
  fungi: `@inproceedings{marzoug2026fungi,
  title     = {Hybrid Generative Architecture for Synthetic Data Augmentation in Fungi Segmentation},
  author    = {Marzoug, Nabil and Akhloufi, Moulay A.},
  booktitle = {International Conference on Industrial, Engineering and Other Applications of Applied Intelligent Systems (IEA/AIE)},
  address   = {Kuala Lumpur, Malaysia},
  year      = {2026},
  publisher = {Springer},
  note      = {Accepted}
}`,
  icoa: `@inproceedings{elhadaf2024spare,
  title     = {Optimizing Spare Parts Inventory Management Using Genetic Algorithm},
  author    = {El Hadaf, H. and Marzoug, Nabil and Jraifi, A.},
  booktitle = {International Conference on Optimization and Applications (ICOA)},
  year      = {2024},
  publisher = {IEEE}
}`,
  lidarknet: `@inproceedings{marzoug2023lidarknet,
  title     = {LIDarknet: Experimenting the Power of Ensemble Learning in the Classification of Network Traffic},
  author    = {Marzoug, Nabil and Halab, K. and Mamma, Y. and others},
  booktitle = {8th IEEE Cyber Science and Technology Congress (CyberSciTech)},
  year      = {2023},
  publisher = {IEEE}
}`
};

(function () {
  var FR = (document.documentElement.lang || '').indexOf('fr') === 0;
  var T = FR ? { copy: 'Copier', copied: 'Copié' } : { copy: 'Copy', copied: 'Copied' };
  function init() {
    document.querySelectorAll('[data-bib]').forEach(function (host) {
      var bib = window.BIBTEX[host.dataset.bib];
      if (!bib) return;
      var details = document.createElement('details');
      details.className = 'bibtex';
      var summary = document.createElement('summary');
      summary.textContent = 'BibTeX';
      var pre = document.createElement('pre');
      pre.textContent = bib;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bib-copy';
      btn.textContent = T.copy;
      btn.addEventListener('click', function () {
        var done = function () { btn.textContent = T.copied; setTimeout(function () { btn.textContent = T.copy; }, 1500); };
        if (navigator.clipboard) navigator.clipboard.writeText(bib).then(done, function () {});
        else { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      });
      details.append(summary, btn, pre);
      host.appendChild(details);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
