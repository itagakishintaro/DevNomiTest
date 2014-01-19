import geb.report.ScreenshotReporter

import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.ie.InternetExplorerDriver


reportsDir = "gebreport"

driver = {
	System.setProperty('webdriver.chrome.driver', 'webdriver/chromedriver.exe')
	new ChromeDriver()
}

environments {
	// when system property 'geb.env' is set to 'ie' use a remote IE driver
	// -Dgeb.env=ie
	'ie' {
		driver = {
			System.setProperty('webdriver.ie.driver', 'webdriver/IEDriverServer.exe')
			new InternetExplorerDriver()
		}
	}
	'firefox'{
		driver = {
			System.setProperty("webdriver.firefox.bin","D:\\Program Files\\Mozilla Firefox\\firefox.exe")
			new FirefoxDriver()
		}
	}
}

reporter = new ScreenshotReporter() {
	@Override
	protected escapeFileName(String name) {
		// name.replaceAll("[^\\w\\s-]", "_")
		name.replaceAll('[\\\\/:\\*?\\"&lt;>\\|]', '_')
	}
}