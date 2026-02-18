<template>
  <u-container class="text-center py-16">
    <h1 class="text-4xl font-bold mb-8">
      Scandinavian &nbsp;<span class="text-primary">Social Security Number</span>&nbsp;Generator and Validator
    </h1>
    <u-container>
      <p class="text-lg mb-4">
        This project provides <strong>tool for generating and validating Scandinavian Social Security Numbers (SSNs)</strong>. All SSN generation and validation processes are performed entirely in the browser.
      </p>
      <p class="text-lg mb-4">
        The algorithms are based on the official formats used in Scandinavian countries.
      </p>

      <u-container>
        <h2 class="font-bold mb-4 mt-8">
          Go to respective pages to generate or validate SSNs for each Scandinavian country.
        </h2>
        <div class="mt-4 space-x-4 flex items-center justify-center flex-wrap gap-4">
          <u-button to="/sweden">
            Sweden
          </u-button>
          <u-button to="/norway">
            Norway
          </u-button>
          <u-button to="/denmark">
            Denmark
          </u-button>
          <u-button to="/finland">
            Finland
          </u-button>
          <u-button to="/iceland">
            Iceland
          </u-button>
        </div>
      </u-container>
    </u-container>
  </u-container>
</template>
