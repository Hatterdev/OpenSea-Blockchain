import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'qpdj996k',
  dataset: 'production',
  apiVersion: '2021-10-21',
  token:
    'sk4NcElGKS5nmuOZoNC49MhohqJzQTXlULCSGJNCrFBenGkuoVwRTCP4Vj2qV8lX1AMBqovDwGy61pnXpmzxxdVvCMfP70gnT3YDOQqQw2Ko3QDe90O7LWRR7ddbJFB2bgDGsbX2rzOlb8w8eGzvOWLbepE2RiSdLjpfAHoDjWgWAbr9Gmaq',
  useCdn: false,
})
