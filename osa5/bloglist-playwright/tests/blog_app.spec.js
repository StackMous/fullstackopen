const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Musta Naamio',
        username: 'mustis',
        password: 'bengali'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Other User',
        username: 'otheruser',
        password: 'bengali'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await page.getByText('Blog')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mustis', 'bengali')
      await expect(page.getByText('Musta Naamio logged in')).toBeVisible()  
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'singh', 'merirosvo')
       
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    
      await expect(page.getByText('Musta Naamio logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mustis', 'bengali')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 
        'Vanhat Viidakon Sananlaskut', 
        'Kit Walker', 
        'www.viidakkopartio.fi')
      await expect(page.getByText('Vanhat Viidakon Sananlaskut')).toBeVisible()
      await expect(page.getByText('Kit Walker')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 
          'Viidakkoheimolaisten paras harrastus', 
          'Guran', 
          'www.kaislahameiden-kutominen.fi')
        await page.getByText('Guran').waitFor()
      })
    
      test('a blog can be liked', async ({ page }) => {
        await expect(page.getByText('Guran')).toBeVisible()
        
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).waitFor()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('a blog can be removed', async ({ page }) => {
        await expect(page.getByText('Guran')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).waitFor()
        page.on('dialog', dialog => {
          console.log(dialog.message())
          dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()
        // varmista että Guranin blogi on poistunut
        await expect(page.getByText('Guran')).not.toBeVisible()
      })

      test('the blog adder sees the remove button, but the others don´t', async ({ page }) => {
        await expect(page.getByText('Guran')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).waitFor()
        await page.getByRole('button', { name: 'logout' }).click()

        // reload page
        await page.goto('http://localhost:5173')
        await loginWith(page, 'otheruser', 'bengali')
        await expect(page.getByText('Other User logged in')).toBeVisible()
        // view details
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Guran')).toBeVisible()
        // verify remove button is not visible
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()        
      })

      // This test works with Playwright UI, firefox & webkit. But not with chromium.
      test('the blogs are ordered in most likes first', async ({ page }) => {
        // Create most liked blog (by me!)
        await createBlog(page, 
          'Eniten pidetty blogi', 
          'Meitsi', 
          'www.setamies-suppaa.fi')
        await page.getByText('Meitsi').waitFor()
        // Create most hated blog (by some wet glove)
        await createBlog(page, 
          'Vähiten pidetty blogi', 
          'Petteri Orpo', 
          'www.hyvahallitusohjelma.fi')
        await page.getByText('Petteri Orpo').waitFor()

        // Do lots of clicking
        const blogs = await page.getByTestId('blog').all()
    
        // 2 clicks for the 1st blog
        await blogs[0].getByRole('button', { name: 'view' }).click()
        await blogs[0].getByRole('button', { name: 'like' }).click()
        // wait for rendering
        await page.getByText('likes 1').waitFor()
        await blogs[0].getByRole('button', { name: 'like' }).click()
    
        // 3 clicks for the 2nd blog
        await blogs[1].getByRole('button', { name: 'view' }).click()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        // wait for rendering
        await page.getByText('likes 1').waitFor()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        // wait for rendering
        await page.getByText('likes 2').waitFor()
        await blogs[1].getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 3').waitFor()
    
        // 1 click for the 3rd blog
        await blogs[2].getByRole('button', { name: 'view' }).click()
        await blogs[2].getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1').waitFor()

        // reload page to close all the details
        await page.goto('http://localhost:5173')
        // wait for the last blog to be rendered
        await page.getByText('Petteri Orpo').waitFor()

        // click all details open
        const result = await page.getByTestId('blog').all()
        await result[0].getByRole('button', { name: 'view' }).click()
        await page.getByText('likes 3').waitFor()
        await result[1].getByRole('button', { name: 'view' }).click()
        await page.getByText('likes 2').waitFor()
        await result[2].getByRole('button', { name: 'view' }).click()
        await page.getByText('likes 1').waitFor()
        // wait for rendering the most hated blog

        // Likes should be in descending order
        await expect(result[0].getByText('likes 3')).toBeVisible({ timeout: 10_000 })
        await expect(result[1].getByText('likes 2')).toBeVisible({ timeout: 10_000 })
        await expect(result[2].getByText('likes 1')).toBeVisible({ timeout: 10_000 })
      })
    })  
  })
})